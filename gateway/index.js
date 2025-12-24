require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const { createLogger, requestLoggerMiddleware } = require('../shared/logger');

const app = express();
const PORT = process.env.GATEWAY_PORT || 8000;

// Initialize structured logger
const logger = createLogger('api-gateway');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Security headers
app.use(requestLoggerMiddleware(logger)); // Structured request logging

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
            logger.error(`Proxy Error (${route})`, { 
                route, 
                target, 
                error: err.message,
                url: req.originalUrl
            });
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
    logger.info(`API Gateway running on port ${PORT}`, { port: PORT });
    logger.info('Gateway URL', { url: `http://localhost:${PORT}` });
    logger.info('Configured Routes', { 
        routes: services.map(s => ({ route: s.route, target: s.target }))
    });
});
