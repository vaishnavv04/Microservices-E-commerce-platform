/**
 * Shared Logger for E-Commerce Platform
 * 
 * A Winston-based structured logger that sends logs to:
 * 1. Console (for development)
 * 2. Logstash via TCP (for centralized logging in ELK)
 * 
 * Usage:
 *   const { createLogger } = require('../shared/logger');
 *   const logger = createLogger('user-service');
 *   logger.info('User logged in', { userId: 123 });
 */

const winston = require('winston');
const net = require('net');
const os = require('os');

// Custom TCP transport for Logstash
class LogstashTransport extends winston.Transport {
  constructor(options = {}) {
    super(options);
    this.host = options.host || process.env.LOGSTASH_HOST || 'localhost';
    this.port = options.port || parseInt(process.env.LOGSTASH_PORT) || 5044;
    this.serviceName = options.serviceName || 'unknown-service';
    this.retryInterval = options.retryInterval || 5000;
    this.connected = false;
    this.queue = [];
    this._connect();
  }

  _connect() {
    this.socket = new net.Socket();
    
    this.socket.connect(this.port, this.host, () => {
      this.connected = true;
      // Flush queued messages
      while (this.queue.length > 0) {
        const msg = this.queue.shift();
        this._send(msg);
      }
    });

    this.socket.on('error', (err) => {
      this.connected = false;
      // Silently handle connection errors - logs will be queued
    });

    this.socket.on('close', () => {
      this.connected = false;
      // Attempt to reconnect after interval
      setTimeout(() => this._connect(), this.retryInterval);
    });
  }

  _send(message) {
    if (this.socket && this.connected) {
      try {
        this.socket.write(message + '\n');
      } catch (err) {
        this.queue.push(message);
      }
    } else {
      // Queue message if not connected
      if (this.queue.length < 1000) {
        this.queue.push(message);
      }
    }
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const logEntry = {
      ...info,
      service: this.serviceName,
      hostname: os.hostname(),
      pid: process.pid,
      timestamp: new Date().toISOString()
    };

    this._send(JSON.stringify(logEntry));
    callback();
  }
}

/**
 * Create a logger instance for a service
 * @param {string} serviceName - Name of the microservice
 * @param {object} options - Additional logger options
 * @returns {winston.Logger} Configured Winston logger
 */
function createLogger(serviceName, options = {}) {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Console format - colorized for development, JSON for production
  const consoleFormat = isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} [${serviceName}] ${level}: ${message}${metaStr}`;
        })
      );

  const transports = [
    // Console transport - always enabled
    new winston.transports.Console({
      format: consoleFormat
    })
  ];

  // Add Logstash transport in production or when LOGSTASH_HOST is set
  if (isProduction || process.env.LOGSTASH_HOST) {
    transports.push(
      new LogstashTransport({
        serviceName,
        host: process.env.LOGSTASH_HOST,
        port: parseInt(process.env.LOGSTASH_PORT) || 5044,
        ...options.logstash
      })
    );
  }

  const logger = winston.createLogger({
    level: logLevel,
    defaultMeta: {
      service: serviceName,
      // TODO: Add custom fields here
      // Example: environment, version, region
      // environment: process.env.NODE_ENV,
      // version: process.env.APP_VERSION,
    },
    transports
  });

  // Add request logging helper
  logger.logRequest = (req, res, duration) => {
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.connection?.remoteAddress,
      // TODO: Add request ID for distributed tracing
      // requestId: req.headers['x-request-id'],
      // TODO: Add user ID if authenticated
      // userId: req.user?.id,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  };

  // Add error logging helper
  logger.logError = (error, context = {}) => {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      ...context
    });
  };

  return logger;
}

/**
 * Express middleware for request logging
 * @param {winston.Logger} logger - Logger instance
 * @returns {Function} Express middleware
 */
function requestLoggerMiddleware(logger) {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Log after response is finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.logRequest(req, res, duration);
    });
    
    next();
  };
}

module.exports = {
  createLogger,
  requestLoggerMiddleware,
  LogstashTransport
};
