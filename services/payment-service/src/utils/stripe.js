const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY && STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key' 
  ? require('stripe')(STRIPE_SECRET_KEY) 
  : null;

const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  // Mock mode if Stripe is not configured
  if (!stripe) {
    console.warn('⚠️  Stripe not configured - using mock payment intent');
    return {
      clientSecret: 'mock_client_secret_' + Date.now(),
      paymentIntentId: 'pi_mock_' + Date.now(),
      status: 'requires_payment_method',
      mock: true,
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw error;
  }
};

const confirmPayment = async (paymentIntentId) => {
  // Mock mode if Stripe is not configured
  if (!stripe || paymentIntentId.startsWith('pi_mock_')) {
    console.warn('⚠️  Stripe not configured - using mock payment confirmation');
    return {
      success: true,
      paymentIntentId: paymentIntentId,
      amount: 0,
      currency: 'usd',
      status: 'succeeded',
      mock: true,
    };
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    }

    return {
      success: false,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      message: `Payment status: ${paymentIntent.status}`,
    };
  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    throw error;
  }
};

const createRefund = async (paymentIntentId, amount = null) => {
  // Mock mode if Stripe is not configured
  if (!stripe || paymentIntentId.startsWith('pi_mock_')) {
    console.warn('⚠️  Stripe not configured - using mock refund');
    return {
      success: true,
      refundId: 're_mock_' + Date.now(),
      amount: amount || 0,
      status: 'succeeded',
      mock: true,
    };
  }

  try {
    const refundParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100, // Convert from cents
      status: refund.status,
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createRefund,
};

