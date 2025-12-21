const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
    url: REDIS_URL,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('ready', () => {
    console.log('Redis client ready');
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.error('Redis connection error:', error);
        throw error;
    }
};

module.exports = {
    redisClient,
    connectRedis,
};
