require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const { createLogger, requestLoggerMiddleware } = require('../../../shared/logger');

const app = express();
const PORT = process.env.PORT || 3005;

// Initialize structured logger
const logger = createLogger('payment-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware(logger));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

// Routes
app.use('/', paymentRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`, { port: PORT });
});

module.exports = app;
