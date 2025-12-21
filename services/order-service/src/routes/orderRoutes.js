const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateProcessOrderWithPayment,
  validateConfirmOrderPayment,
} = require('../middleware/validation');

router.post('/orders', validateCreateOrder, orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/user/:userId', orderController.getUserOrders);
router.put('/orders/:id/status', validateUpdateOrderStatus, orderController.updateOrderStatus);
router.post('/orders/process', validateProcessOrderWithPayment, orderController.processOrderWithPayment);
router.post('/orders/confirm-payment', validateConfirmOrderPayment, orderController.confirmOrderPayment);

module.exports = router;

