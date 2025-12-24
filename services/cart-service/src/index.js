require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
const { connectRedis, redisClient } = require('./utils/redis');
const { createLogger, requestLoggerMiddleware } = require('../../../shared/logger');

const app = express();
const PORT = process.env.PORT || 3003;

// Initialize structured logger
const logger = createLogger('cart-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware(logger));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Ping Redis to check connection
    await redisClient.ping();
    res.json({ status: 'ok', service: 'cart-service', database: 'redis' });
  } catch (error) {
    logger.warn('Health check failed - Redis disconnected', { error: error.message });
    res.status(503).json({ status: 'error', service: 'cart-service', database: 'disconnected' });
  }
});

// Routes
app.use('/', cartRoutes);

// Connect to Redis and start server
connectRedis()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Cart Service running on port ${PORT}`, { port: PORT });
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to Redis', { error: error.message, stack: error.stack });
    process.exit(1);
  });

module.exports = app;
