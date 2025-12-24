require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { initDatabase } = require('./utils/database');
const { createLogger, requestLoggerMiddleware } = require('../../../shared/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize structured logger
const logger = createLogger('user-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware(logger));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

// Routes
app.use('/', userRoutes);

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`, { port: PORT });
    });
  })
  .catch((error) => {
    logger.error('Failed to initialize database', { error: error.message, stack: error.stack });
    process.exit(1);
  });

module.exports = app;
