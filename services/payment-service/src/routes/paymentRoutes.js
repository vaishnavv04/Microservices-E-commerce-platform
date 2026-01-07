const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {
  validateCreateOrder,
  validateVerify,
  validateRefund,
} = require('../middleware/validation');

// Create a payment order (Razorpay order)
router.post('/payments/order', validateCreateOrder, paymentController.createPaymentOrder);

// Verify payment after Razorpay checkout
router.post('/payments/verify', validateVerify, paymentController.verify);

// Process refund
router.post('/payments/refund', validateRefund, paymentController.refund);

// Legacy endpoint aliases for backward compatibility
router.post('/payments/intent', validateCreateOrder, paymentController.createPaymentOrder);
router.post('/payments/confirm', validateVerify, paymentController.verify);

module.exports = router;
