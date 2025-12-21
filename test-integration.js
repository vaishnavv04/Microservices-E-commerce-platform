/**
 * Integration Test Script for E-Commerce Platform
 * 
 * This script tests the complete workflow:
 * 1. User registration
 * 2. Product creation
 * 3. Add items to cart
 * 4. Create order
 * 5. Process payment
 * 6. Update order status
 * 
 * Run with: node test-integration.js
 */

const axios = require('axios');

const BASE_URLS = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};

let authToken = null;
let userId = null;
let productId = null;
let cartItemId = null;
let orderId = null;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testHealthChecks() {
  console.log('\n=== Testing Health Checks ===');
  try {
    for (const [service, url] of Object.entries(BASE_URLS)) {
      const response = await axios.get(`${url}/health`);
      console.log(`✓ ${service} service: ${response.data.status}`);
    }
    return true;
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n=== Testing User Registration ===');
  try {
    const email = `test${Date.now()}@example.com`;
    const response = await axios.post(`${BASE_URLS.user}/register`, {
      email,
      password: 'password123',
      name: 'Test User',
    });
    
    authToken = response.data.token;
    userId = response.data.user.id;
    console.log(`✓ User registered: ${email} (ID: ${userId})`);
    console.log(`✓ Auth token received`);
    return true;
  } catch (error) {
    console.error('✗ Registration failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n=== Testing User Login ===');
  try {
    const email = `test${Date.now()}@example.com`;
    // First register
    await axios.post(`${BASE_URLS.user}/register`, {
      email,
      password: 'password123',
      name: 'Test User',
    });
    
    // Then login
    const response = await axios.post(`${BASE_URLS.user}/login`, {
      email,
      password: 'password123',
    });
    
    authToken = response.data.token;
    userId = response.data.user.id;
    console.log(`✓ User logged in: ${email} (ID: ${userId})`);
    return true;
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateProduct() {
  console.log('\n=== Testing Product Creation ===');
  try {
    const response = await axios.post(`${BASE_URLS.product}/products`, {
      name: 'Test Product',
      description: 'A test product for integration testing',
      price: 29.99,
      inventory: 100,
    });
    
    productId = response.data.product.id;
    console.log(`✓ Product created: ${response.data.product.name} (ID: ${productId})`);
    return true;
  } catch (error) {
    console.error('✗ Product creation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetProducts() {
  console.log('\n=== Testing Get Products ===');
  try {
    const response = await axios.get(`${BASE_URLS.product}/products`);
    console.log(`✓ Retrieved ${response.data.products.length} products`);
    if (response.data.products.length > 0 && !productId) {
      productId = response.data.products[0].id;
    }
    return true;
  } catch (error) {
    console.error('✗ Get products failed:', error.response?.data || error.message);
    return false;
  }
}

async function testAddToCart() {
  console.log('\n=== Testing Add to Cart ===');
  try {
    if (!userId || !productId) {
      console.log('⚠ Skipping: userId or productId not set');
      return false;
    }
    
    const response = await axios.post(`${BASE_URLS.cart}/cart/items`, {
      userId,
      productId,
      quantity: 2,
    });
    
    cartItemId = response.data.item.id;
    console.log(`✓ Item added to cart (Item ID: ${cartItemId})`);
    return true;
  } catch (error) {
    console.error('✗ Add to cart failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetCart() {
  console.log('\n=== Testing Get Cart ===');
  try {
    if (!userId) {
      console.log('⚠ Skipping: userId not set');
      return false;
    }
    
    const response = await axios.get(`${BASE_URLS.cart}/cart/${userId}`);
    console.log(`✓ Cart retrieved: ${response.data.items.length} items`);
    return true;
  } catch (error) {
    console.error('✗ Get cart failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateOrder() {
  console.log('\n=== Testing Create Order ===');
  try {
    if (!userId) {
      console.log('⚠ Skipping: userId not set');
      return false;
    }
    
    const response = await axios.post(`${BASE_URLS.order}/orders`, {
      userId,
      shippingAddress: '123 Test St, Test City, TC 12345',
    });
    
    orderId = response.data.order.id;
    console.log(`✓ Order created (Order ID: ${orderId}, Total: $${response.data.order.total_amount})`);
    return true;
  } catch (error) {
    console.error('✗ Create order failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetOrder() {
  console.log('\n=== Testing Get Order ===');
  try {
    if (!orderId) {
      console.log('⚠ Skipping: orderId not set');
      return false;
    }
    
    const response = await axios.get(`${BASE_URLS.order}/orders/${orderId}`);
    console.log(`✓ Order retrieved: ${response.data.order.status}`);
    return true;
  } catch (error) {
    console.error('✗ Get order failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateOrderStatus() {
  console.log('\n=== Testing Update Order Status ===');
  try {
    if (!orderId) {
      console.log('⚠ Skipping: orderId not set');
      return false;
    }
    
    const response = await axios.put(`${BASE_URLS.order}/orders/${orderId}/status`, {
      status: 'processing',
    });
    
    console.log(`✓ Order status updated: ${response.data.order.status}`);
    return true;
  } catch (error) {
    console.error('✗ Update order status failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Integration Tests for E-Commerce Platform\n');
  
  const results = {
    passed: 0,
    failed: 0,
  };
  
  const tests = [
    { name: 'Health Checks', fn: testHealthChecks },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Create Product', fn: testCreateProduct },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Add to Cart', fn: testAddToCart },
    { name: 'Get Cart', fn: testGetCart },
    { name: 'Create Order', fn: testCreateOrder },
    { name: 'Get Order', fn: testGetOrder },
    { name: 'Update Order Status', fn: testUpdateOrderStatus },
  ];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        results.passed++;
      } else {
        results.failed++;
      }
      await delay(500); // Small delay between tests
    } catch (error) {
      console.error(`✗ ${test.name} threw an error:`, error.message);
      results.failed++;
    }
  }
  
  console.log('\n=== Test Results ===');
  console.log(`✓ Passed: ${results.passed}`);
  console.log(`✗ Failed: ${results.failed}`);
  console.log(`Total: ${results.passed + results.failed}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠ Some tests failed. Check the logs above.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testHealthChecks,
  testUserRegistration,
  testUserLogin,
  testCreateProduct,
  testGetProducts,
  testAddToCart,
  testGetCart,
  testCreateOrder,
  testGetOrder,
  testUpdateOrderStatus,
};

