import Product from '../models/productModel.js';
import multer from 'multer';
import xlsx from 'xlsx';

// @desc    Récupérer tous les produits avec leurs options de contenants
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    const enhancedProducts = products.map(product => ({
      ...product.toObject(),
      minPrice: Math.min(...product.contenants.map(c => c.prix)),
      containerOptions: product.contenants.map(c => ({
        type: c.type,
        price: c.prix
      }))
    }));

    res.json({
      success: true,
      count: enhancedProducts.length,
      data: enhancedProducts
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: err.message 
    });
  }
};

// @desc    Créer un nouveau produit avec options de contenants
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
  try {
    // On suppose que l'URL ImgBB est envoyée dans le body
    const { name, price, description, images, category } = req.body;
    
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl, // Utilisation directe de l'URL ImgBB
      category
    });

    res.status(201).json({
      status: 'success',
      data: { product }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Récupérer les produits par catégorie avec options de contenants
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.category 
    }).sort('-createdAt');

    const enhancedProducts = products.map(product => ({
      ...product.toObject(),
      containerOptions: product.contenants.map(c => ({
        type: c.type,
        price: c.prix
      }))
    }));

    res.json({
      success: true,
      count: enhancedProducts.length,
      data: enhancedProducts
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};

// @desc    Exporter les produits vers Excel (inclut les options de contenants)
// @route   GET /api/products/export/excel
// @access  Admin
export const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.find({});
    
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      contenants: product.contenants.map(c => `${c.type}:${c.prix}XAF`).join(', ')
    }));

    const worksheet = xlsx.utils.json_to_sheet(formattedProducts);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Produits");
    
    const buffer = xlsx.write(workbook, { type: 'buffer' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=produits.xlsx');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Filtrer les produits avec prise en compte des contenants
// @route   GET /api/products/filter
// @access  Public
export const filterProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, origin, honeyType, containerType } = req.query;
    const filter = {};

    if (minPrice) filter['contenants.prix'] = { $gte: Number(minPrice) };
    if (maxPrice) filter['contenants.prix'] = { ...filter['contenants.prix'], $lte: Number(maxPrice) };
    if (origin) filter.origine = origin;
    if (honeyType) filter.honeyType = honeyType;
    if (containerType) filter['contenants.type'] = containerType;

    const products = await Product.find(filter);
    
    const enhancedProducts = products.map(product => ({
      ...product.toObject(),
      matchingContainers: product.contenants.filter(c => 
        (!minPrice || c.prix >= Number(minPrice)) && 
        (!maxPrice || c.prix <= Number(maxPrice))
      )
    }));

    res.json({
      success: true,
      count: enhancedProducts.length,
      data: enhancedProducts
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Configuration Multer pour les fichiers Excel
const upload = multer({ storage: multer.memoryStorage() });

// @desc    Mettre à jour les stocks via Excel
// @route   POST /api/products/update-stocks
// @access  Admin
export const updateStocksFromExcel = async (req, res) => {
  try {
    const file = req.file;
    const workbook = xlsx.read(file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const updates = xlsx.utils.sheet_to_json(sheet);

    const bulkOps = updates.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { stock: item.stock } }
      }
    }));

    await Product.bulkWrite(bulkOps);
    
    res.json({ 
      success: true,
      message: `${updates.length} stocks mis à jour` 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Recherche de produits avec highlight des contenants
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    
    const enhancedProducts = products.map(product => ({
      ...product.toObject(),
      containerOptions: product.contenants.map(c => ({
        type: c.type,
        price: c.prix
      }))
    }));

    res.json({
      success: true,
      count: enhancedProducts.length,
      data: enhancedProducts
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Appliquer une promotion sur un contenant spécifique
// @route   PATCH /api/products/:id/discount
// @access  Admin
export const applyDiscount = async (req, res) => {
  try {
    const { discountPercent, containerType } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    // Appliquer la promotion à tous les contenants ou un spécifique
    product.contenants = product.contenants.map(c => {
      if (!containerType || c.type === containerType) {
        return {
          ...c.toObject(),
          prixPromo: c.prix * (1 - discountPercent / 100)
        };
      }
      return c;
    });

    product.isOnSale = true;
    await product.save();
    
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};

// @desc    Récupérer les options de contenants d'un produit
// @route   GET /api/products/:id/containers
// @access  Public
export const getProductContainers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product.contenants.map(c => ({
        type: c.type,
        price: c.prix,
        discountedPrice: c.prixPromo || null
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

export default {
  getProducts,
  createProduct,
  getProductsByCategory,
  exportProductsToExcel,
  filterProducts,
  updateStocksFromExcel: upload.single('file'), // Middleware Multer
  updateStocksFromExcelHandler: updateStocksFromExcel,
  searchProducts,
  applyDiscount,
  getProductContainers
};