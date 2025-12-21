require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.GATEWAY_PORT || 8000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
});

// Service Configuration
const services = [
    {
        route: '/api/users',
        target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    },
    {
        route: '/api/products',
        target: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    },
    {
        route: '/api/cart',
        target: process.env.CART_SERVICE_URL || 'http://localhost:3003',
    },
    {
        route: '/api/orders',
        target: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    },
    {
        route: '/api/payments',
        target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    },
    {
        route: '/api/notifications',
        target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
    },
];

// Setup Proxies
services.forEach(({ route, target }) => {
    // Proxy options
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route}`]: '', // Remove base path when forwarding
        },
        onProxyReq: (proxyReq, req, res) => {
            // You can add custom headers here if needed
            // proxyReq.setHeader('X-Gateway-Auth', 'some-token');
        },
        onError: (err, req, res) => {
            console.error(`Proxy Error (${route}):`, err.message);
            res.status(502).json({
                error: 'Bad Gateway',
                message: `Service at ${route} is unavailable`
            });
        },
    };

    app.use(route, createProxyMiddleware(proxyOptions));
});

// Start Gateway
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📍 Gateway URL: http://localhost:${PORT}`);
    console.log('🔗 Configured Routes:');
    services.forEach(s => console.log(`   ${s.route} -> ${s.target}`));
});
