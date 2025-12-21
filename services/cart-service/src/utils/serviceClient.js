const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';

const verifyUser = async (userId) => {
  try {
    // In a real implementation, you might call the user service
    // For now, we'll just check if userId is provided
    return userId ? true : false;
  } catch (error) {
    console.error('User verification error:', error);
    return false;
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

module.exports = {
  verifyUser,
  getProduct,
};

