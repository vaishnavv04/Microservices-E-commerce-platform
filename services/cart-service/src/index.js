require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
const { connectRedis, redisClient } = require('./utils/redis');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  try {
    // Ping Redis to check connection
    await redisClient.ping();
    res.json({ status: 'ok', service: 'cart-service', database: 'redis' });
  } catch (error) {
    res.status(503).json({ status: 'error', service: 'cart-service', database: 'disconnected' });
  }
});

// Routes
app.use('/', cartRoutes);

// Connect to Redis and start server
connectRedis()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Cart Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  });

module.exports = app;
