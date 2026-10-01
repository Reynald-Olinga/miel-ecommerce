import { sendText } from './whatsappClient.js';

export const sendOrderToWhatsApp = async (order) => {
  const { _id, customerInfo, totalPrice, items, paymentMethod, shippingAddress } = order;

  let msg = `🍯 *NOUVELLE COMMANDE #${_id}*\n\n`;
  msg += `📞 Client : ${customerInfo.name} (${customerInfo.phone})\n`;
  msg += `📍 Livraison : ${shippingAddress.address}, ${shippingAddress.city}\n`;
  msg += `💳 Paiement : ${paymentMethod}\n`;
  msg += `💰 Total : ${totalPrice.toLocaleString('fr-FR')} CFA\n\n`;
  msg += `📦 Articles :\n`;

  items.forEach((it, i) => {
    msg += `${i + 1}. ${it.name} (${it.container.type}) – ${it.container.quantity}×${it.container.unitPrice} CFA\n`;
  });

  await sendText(process.env.WHATSAPP_ADMIN_NUMBER, msg);
  console.log('📲 Notification WhatsApp envoyée');
};