require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const { createLogger, requestLoggerMiddleware } = require('../../../shared/logger');

const app = express();
const PORT = process.env.PORT || 3006;

// Initialize structured logger
const logger = createLogger('notification-service');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware(logger));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// Routes
app.use('/', notificationRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`Notification Service running on port ${PORT}`, { port: PORT });
});

module.exports = app;
