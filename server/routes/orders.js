import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getOrderById,
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { generateOrdersXLSX } from '../utils/exportOrders.js';

const router = express.Router();

// Route pour créer une commande
router.route('/').post(protect, createOrder);

// Route pour exporter toutes les commandes en XLSX
router.get('/export', protect, admin, async (req, res) => {
  try {
    const buffer = await generateOrdersXLSX();

    res.setHeader('Content-Disposition', 'attachment; filename="commandes.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('❌ Erreur export XLSX:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes existantes
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;






























