require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { initDatabase } = require('./utils/database');
const { createLogger, requestLoggerMiddleware } = require('../../../shared/logger');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize structured logger
const logger = createLogger('product-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware(logger));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

// Routes
app.use('/', productRoutes);

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Product Service running on port ${PORT}`, { port: PORT });
    });
  })
  .catch((error) => {
    logger.error('Failed to initialize database', { error: error.message, stack: error.stack });
    process.exit(1);
  });

module.exports = app;
