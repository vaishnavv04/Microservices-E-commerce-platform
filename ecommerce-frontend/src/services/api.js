import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // API Gateway

// Axios instance with auth header
const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post('/api/users/register', data);
export const loginUser = (data) => api.post('/api/users/login', data);
export const getUserProfile = () => api.get('/api/users/profile');

// Products
export const getProducts = () => api.get('/api/products/products');
export const getProductById = (id) => api.get(`/api/products/products/${id}`);
export const getCategories = () => api.get('/api/products/categories');
export const createProduct = (data) => api.post('/api/products/products', data); // Admin only

// Cart
export const getCart = (userId) => api.get(`/api/cart/cart/${userId}`);
export const addToCart = (data) => api.post('/api/cart/cart/items', data);
export const updateCartItem = (itemId, data) => api.put(`/api/cart/cart/items/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/api/cart/cart/items/${itemId}`);
export const clearCart = (userId) => api.delete(`/api/cart/cart/${userId}/clear`);

// Orders
export const createOrder = (data) => api.post('/api/orders/orders', data);
export const getOrderById = (id) => api.get(`/api/orders/orders/${id}`);
export const getUserOrders = (userId) => api.get(`/api/orders/orders/user/${userId}`);
export const updateOrderStatus = (id, data) => api.put(`/api/orders/orders/${id}/status`, data);

// Payments
export const createPaymentIntent = (data) => api.post('/api/payments/payments/intent', data);
export const confirmPayment = (data) => api.post('/api/payments/payments/confirm', data);

// Notifications (optional, for order confirmations)
export const sendEmail = (data) => api.post('/api/notifications/notifications/email', data);