const {
  createPaymentIntent,
  confirmPayment,
  createRefund,
} = require('../utils/stripe');

const createIntent = async (req, res) => {
  try {
    const { amount, currency, orderId, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const metadata = {};
    if (orderId) metadata.orderId = orderId;
    if (userId) metadata.userId = userId;

    const result = await createPaymentIntent(amount, currency || 'usd', metadata);

    res.status(201).json({
      message: 'Payment intent created',
      ...result,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message,
    });
  }
};

const confirm = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const result = await confirmPayment(paymentIntentId);

    if (result.success) {
      res.json({
        message: 'Payment confirmed',
        ...result,
      });
    } else {
      res.status(400).json({
        message: 'Payment not confirmed',
        ...result,
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      details: error.message,
    });
  }
};

const refund = async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }

    const result = await createRefund(paymentIntentId, amount || null);

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
  createIntent,
  confirm,
  refund,
};

