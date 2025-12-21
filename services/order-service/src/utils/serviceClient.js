const axios = require('axios');

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3003';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

const getCart = async (userId) => {
  try {
    const response = await axios.get(`${CART_SERVICE_URL}/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Cart service error:', error);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    await axios.delete(`${CART_SERVICE_URL}/cart/${userId}/clear`);
    return true;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

const createPaymentIntent = async (amount, orderId, userId) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_URL}/payments/intent`, {
      amount,
      currency: 'usd',
      orderId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
};

const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_URL}/payments/confirm`, {
      paymentIntentId,
    });
    return response.data;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
};

const sendEmailNotification = async (to, type, data) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/email`, {
      to,
      type,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Notification service error:', error);
    // Don't throw - notifications are not critical
    return null;
  }
};

const sendSMSNotification = async (to, type, data) => {
  try {
    const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/sms`, {
      to,
      type,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('SMS notification error:', error);
    // Don't throw - notifications are not critical
    return null;
  }
};

const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    return response.data.product;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Product service error:', error);
    throw error;
  }
};

const updateProductInventory = async (productId, quantityChange) => {
  try {
    // Get current product
    const product = await getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = Math.max(0, (product.inventory || 0) + quantityChange);

    await axios.put(`${PRODUCT_SERVICE_URL}/products/${productId}/inventory`, {
      quantity: newQuantity,
    });

    return true;
  } catch (error) {
    console.error('Update inventory error:', error);
    throw error;
  }
};

module.exports = {
  getCart,
  clearCart,
  createPaymentIntent,
  confirmPayment,
  sendEmailNotification,
  sendSMSNotification,
  getProduct,
  updateProductInventory,
};

