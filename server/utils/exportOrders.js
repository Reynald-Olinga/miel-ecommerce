import xlsx from 'xlsx';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

export const generateOrdersXLSX = async () => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .lean();

  if (!orders.length) {
    throw new Error('Aucune commande à exporter');
  }

  const rows = [];

  orders.forEach(order => {
    order.items.forEach(item => {
      rows.push({
        'Commande ID': order._id.toString(),
        'Client': order.user?.name || 'N/A',
        'Email': order.user?.email || 'N/A',
        'Produit': item.name || item.product?.name || 'N/A',
        'Contenant': item.container.type,
        'Quantité': item.container.quantity,
        'Prix unitaire': item.container.unitPrice,
        'Total produit': item.price,
        'Total commande': order.totalPrice,
        'Statut': order.status,
        'Date': order.createdAt.toISOString().split('T')[0],
        'Adresse': `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`,
        'Message': order.message || '',
      });
    });
  });

  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Commandes');

  return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
};