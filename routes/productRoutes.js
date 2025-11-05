const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const Product = require('../models/Product'); 
const {
  addProduct,
  getAllVendorProducts,
  editProduct,
  deleteProduct, getAllProductsForAdmin
} = require('../controllers/productController');

router.post('/add', upload.array('images'), addProduct);
router.get('/all', getAllVendorProducts);

// GET /products/all-admin
router.get('/all-admin', getAllProductsForAdmin);

router.get('/:id', async (req, res) => {
  try {
  const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
