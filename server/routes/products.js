import express from 'express';
import Product from '../models/productModel.js'; 
import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  getProducts,
  createProduct,
  getProductsByCategory,
  exportProductsToExcel,
  filterProducts,
  searchProducts,
  applyDiscount,
} from '../controllers/productController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits de la boutique
 */

// -------------------------------------------------
// Routes publiques
// -------------------------------------------------
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/filter', filterProducts);
router.get('/search', searchProducts);
router.get('/export/excel', exportProductsToExcel);

// -------------------------------------------------
// Routes admin
// -------------------------------------------------

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Créer un produit (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produit créé
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', protect, admin, createProduct);

/**
 * @swagger
 * /api/products/{id}/discount:
 *   patch:
 *     summary: Appliquer une remise (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Remise appliquée
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/discount', protect, admin, applyDiscount);

/**
 * @swagger
 * /api/products/{id}/stock-global:
 *   patch:
 *     summary: Mettre à jour le stock global d’un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockGlobal:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock global mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/stock-global', protect, admin, async (req, res) => {
  try {
    const { stockGlobal } = req.body;
    if (typeof stockGlobal !== 'number' || stockGlobal < 0) {
      return res.status(400).json({ message: 'stockGlobal doit être un entier positif' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stockGlobal },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// server/routes/products.js
router.post('/stock-batch', protect, admin, async (req, res) => {
  try {
    const { updates } = req.body;

    for (const update of updates) {
      const { productId, containerType, newGlobalStock, newContainerStock } = update;

      const product = await Product.findById(productId);
      if (!product) continue;

      if (newGlobalStock !== undefined) {
        product.stockGlobal = newGlobalStock;
      }

      if (newContainerStock !== undefined && containerType) {
        const container = product.contenants.find(c => c.type === containerType);
        if (container) {
          container.stock = newContainerStock;
        }
      }

      await product.save();
    }

    res.json({ success: true, message: 'Stocks mis à jour en masse' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


/**
 * @swagger
 * /api/products/{id}/containers/{type}/stock:
 *   patch:
 *     summary: Mettre à jour le stock d’un contenant spécifique
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock du contenant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit ou contenant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/containers/:type/stock', protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'stock doit être un entier positif' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });

    const container = product.contenants.find(c => c.type === req.params.type);
    if (!container) return res.status(404).json({ message: 'Contenant introuvable' });

    container.stock = stock;
    await product.save();

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------
// Documentation Swagger schémas
// -------------------------------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         honeyType:
 *           type: string
 *         stockGlobal:
 *           type: integer
 *         contenants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               stock:
 *                 type: integer
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         honeyType:
 *           type: string
 *         stockGlobal:
 *           type: integer
 *         contenants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               stock:
 *                 type: integer
 */

export default router;






