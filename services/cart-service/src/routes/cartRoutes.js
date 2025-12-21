const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateAddItem, validateUpdateItem } = require('../middleware/validation');

router.get('/cart/:userId', cartController.getCart);
router.post('/cart/items', validateAddItem, cartController.addItem);
router.put('/cart/items/:itemId', validateUpdateItem, cartController.updateItem);
router.delete('/cart/items/:itemId', cartController.removeItem);
router.delete('/cart/:userId/clear', cartController.clearCart);

module.exports = router;

