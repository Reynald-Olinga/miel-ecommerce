import express from 'express';
import { 
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} from '../controllers/cartController.js';
import { protect, admin, restrictTo } from '../middlewares/authMiddleware.js';


const router = express.Router(); // Créez une nouvelle instance de routeur

router.use(protect); // Middleware de protection

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:itemId')
  .patch(updateCartItem)
  .delete(removeFromCart);


// Route protégée standard
router.get('/profile', protect);

// Route admin seulement
router.get('/admin', protect, admin);

// Route pour rôles spécifiques
router.get('/manager', protect, restrictTo('admin', 'manager'));

// Exportez le routeur COMPLET
export default router; // <-- L'export crucial


