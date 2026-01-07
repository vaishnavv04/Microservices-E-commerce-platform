const {
  createOrder,
  verifyPayment,
  createRefund,
} = require('../utils/razorpay');

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency, orderId, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const metadata = {};
    if (orderId) metadata.orderId = String(orderId);
    if (userId) metadata.userId = String(userId);

    const result = await createOrder(amount, currency || 'INR', metadata);

    res.status(201).json({
      message: 'Payment order created',
      ...result,
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      details: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const result = await verifyPayment(orderId, paymentId, signature);

    if (result.success) {
      res.json({
        message: 'Payment verified successfully',
        ...result,
      });
    } else {
      res.status(400).json({
        message: 'Payment verification failed',
        ...result,
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      details: error.message,
    });
  }
};

const refund = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }

    const result = await createRefund(paymentId, amount || null);

    res.json({
      message: 'Refund processed',
      ...result,
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      error: 'Failed to process refund',
      details: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verify,
  refund,
};
