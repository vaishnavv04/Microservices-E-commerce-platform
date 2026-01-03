const Razorpay = require('razorpay');
const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay instance only if credentials are configured
const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_ID !== 'rzp_test_your_key_id'
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

/**
 * Create a Razorpay order (equivalent to Stripe PaymentIntent)
 * @param {number} amount - Amount in rupees (will be converted to paise)
 * @param {string} currency - Currency code (default: INR)
 * @param {object} metadata - Additional metadata (notes)
 */
const createOrder = async (amount, currency = 'INR', metadata = {}) => {
  // Mock mode if Razorpay is not configured
  if (!razorpay) {
    console.warn('⚠️  Razorpay not configured - using mock order');
    return {
      orderId: 'order_mock_' + Date.now(),
      amount: amount,
      currency: currency,
      status: 'created',
      keyId: 'rzp_test_mock',
      mock: true,
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      notes: metadata,
    });

    return {
      orderId: order.id,
      amount: order.amount / 100, // Convert back to rupees for response
      currency: order.currency,
      status: order.status,
      keyId: RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
};

/**
 * Verify payment signature from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
const verifyPayment = async (orderId, paymentId, signature) => {
  // Mock mode if Razorpay is not configured
  if (!razorpay || orderId.startsWith('order_mock_')) {
    console.warn('⚠️  Razorpay not configured - using mock verification');
    return {
      success: true,
      paymentId: paymentId || 'pay_mock_' + Date.now(),
      orderId: orderId,
      status: 'captured',
      mock: true,
    };
  }

  try {
    // Create the expected signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;

    if (isValid) {
      // Fetch payment details for additional info
      const payment = await razorpay.payments.fetch(paymentId);
      
      return {
        success: true,
        paymentId: paymentId,
        orderId: orderId,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
      };
    }

    return {
      success: false,
      orderId: orderId,
      message: 'Payment signature verification failed',
    };
  } catch (error) {
    console.error('Razorpay verification error:', error);
    throw error;
  }
};

/**
 * Create a refund for a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Optional partial refund amount in rupees
 */
const createRefund = async (paymentId, amount = null) => {
  // Mock mode if Razorpay is not configured
  if (!razorpay || paymentId.startsWith('pay_mock_')) {
    console.warn('⚠️  Razorpay not configured - using mock refund');
    return {
      success: true,
      refundId: 'rfnd_mock_' + Date.now(),
      paymentId: paymentId,
      amount: amount || 0,
      status: 'processed',
      mock: true,
    };
  }

  try {
    const refundParams = {};
    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundParams);

    return {
      success: true,
      refundId: refund.id,
      paymentId: paymentId,
      amount: refund.amount / 100, // Convert back to rupees
      status: refund.status,
    };
  } catch (error) {
    console.error('Razorpay refund error:', error);
    throw error;
  }
};

/**
 * Fetch payment details
 * @param {string} paymentId - Razorpay payment ID
 */
const fetchPayment = async (paymentId) => {
  if (!razorpay || paymentId.startsWith('pay_mock_')) {
    return {
      id: paymentId,
      amount: 0,
      currency: 'INR',
      status: 'captured',
      mock: true,
    };
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      orderId: payment.order_id,
    };
  } catch (error) {
    console.error('Razorpay fetch payment error:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  createRefund,
  fetchPayment,
};
