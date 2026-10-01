import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { appendOrderToExcel } from '../utils/excel.js';
import { sendOrderToWhatsApp } from '../utils/orderNotifier.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, message, customer, total } = req.body;

    console.log('📦 Requête reçue:', req.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Votre panier est vide' });
    }

    let orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Produit introuvable` });
      }

      // 1️⃣ Vérification stock global (honeyType)
      if (product.stockGlobal < item.quantity) {
        return res.status(400).json({ success: false, message: `Stock insuffisant pour ${product.name} (${item.containerType})` });
      }

      // 2️⃣ Vérification stock contenant
      const containerIndex = product.contenants.findIndex(c => c.type === item.containerType);
      if (containerIndex === -1) {
        return res.status(400).json({ success: false, message: `Stock contenant insuffisant pour ${product.name} (${item.containerType})` });
      }

      if (product.contenants[containerIndex].stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Stock contenant insuffisant pour ${product.name} (${item.containerType})` });
      }

      const unitPrice = product.contenants[containerIndex].prixPromo || product.contenants[containerIndex].prix;
      calculatedTotal += unitPrice * item.quantity;

      const productImage = Array.isArray(product.images)
        ? product.images[0]
        : (product.images || '');

      orderItems.push({
        product: item.product,
        name: product.name,
        image: productImage,
        container: {
          type: item.containerType,
          unitPrice,
          quantity: item.quantity,
        },
        price: unitPrice * item.quantity,
      });

      // 3️⃣ Décrémentation des stocks
      product.stockGlobal -= item.quantity;
      product.contenants[containerIndex].stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        country: shippingAddress.country || 'Cameroun',
        postalCode: shippingAddress.postalCode || '00000',
      },
      paymentMethod,
      totalPrice: calculatedTotal,
      status: 'En attente',
      message: message || '',
      customerInfo: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
      },
    });

    const savedOrder = await order.save();

    // 📲 Envoi WhatsApp (non bloquant)
    try {
      await sendOrderToWhatsApp(savedOrder);
    } catch (waErr) {
      console.warn('⚠️ WhatsApp notification failed:', waErr.message);
    }

    // Excel (optionnel)
    try {
      const user = await User.findById(req.user._id);
      await appendOrderToExcel({ ...savedOrder.toObject(), user });
    } catch (excelError) {
      console.warn('⚠️ Erreur Excel (non bloquante):', excelError.message);
    }

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Commande créée avec succès !',
    });
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------------------------------------
// Autres fonctions inchangées
// ------------------------------------------------------------------

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    order.status = status;
    if (status === 'Livrée') order.deliveredAt = Date.now();
    await order.save();

    res.json({ success: true, data: order, message: `Statut: ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};















