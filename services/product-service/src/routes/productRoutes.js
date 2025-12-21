const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateUpdateInventory,
} = require('../middleware/validation');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.get('/categories', productController.getAllCategories);
router.post('/products', validateCreateProduct, productController.createProduct);
router.put('/products/:id', validateUpdateProduct, productController.updateProduct);
router.put('/products/:productId/inventory', validateUpdateInventory, productController.updateInventory);

module.exports = router;

