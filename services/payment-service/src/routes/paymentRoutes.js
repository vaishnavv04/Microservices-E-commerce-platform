const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const {
  validateCreateIntent,
  validateConfirm,
  validateRefund,
} = require('../middleware/validation');

router.post('/payments/intent', validateCreateIntent, paymentController.createIntent);
router.post('/payments/confirm', validateConfirm, paymentController.confirm);
router.post('/payments/refund', validateRefund, paymentController.refund);

module.exports = router;

