/**
 * Database configuration utility
 * Supports both DATABASE_URL and individual connection parameters
 * 
 * Priority:
 * 1. Service-specific DATABASE_URL (DATABASE_URL_ORDERS)
 * 2. Generic DATABASE_URL (for Supabase - single database)
 * 3. Individual connection parameters
 */
const getDbConfig = () => {
  // Check for service-specific DATABASE_URL first, then generic DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL_ORDERS || process.env.DATABASE_URL;
  
  if (databaseUrl) {
    return {
      connectionString: databaseUrl,
    };
  }

  // Otherwise, use individual connection parameters
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ecommerce_orders',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
};

module.exports = { getDbConfig };

