import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


// Récupérer le panier
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// addToCart  :
export const addToCart = async (req, res) => {
  try {
    const { product, containerType, quantity = 1 } = req.body;
    
    if (!product || !containerType) {
      return res.status(400).json({ message: 'Produit et type de contenant requis' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], total: 0 });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === product && item.containerType === containerType
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, containerType, quantity });
    }

    // Calcul du total avec les prix des contenants
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      const container = item.product.contenants.find(c => c.type === item.containerType);
      return sum + (container ? container.prix * item.quantity : 0);
    }, 0);

    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remplacer updateCartItem par :
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    
    const item = cart.items.find(item => item._id.toString() === req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Article non trouvé' });
    
    item.quantity = quantity;
    
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      const container = item.product.contenants.find(c => c.type === item.containerType);
      return sum + (container ? container.prix * item.quantity : 0);
    }, 0);
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remplacer removeFromCart par :
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items.pull(req.params.itemId);
    
    await cart.populate('items.product');
    cart.total = cart.items.reduce((sum, item) => {
      const container = item.product.contenants.find(c => c.type === item.containerType);
      return sum + (container ? container.prix * item.quantity : 0);
    }, 0);
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Exporter TOUTES les fonctions
export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};