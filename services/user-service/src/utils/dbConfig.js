/**
 * Database configuration utility
 * Supports both DATABASE_URL and individual connection parameters
 * 
 * Priority:
 * 1. Service-specific DATABASE_URL (DATABASE_URL_USERS)
 * 2. Generic DATABASE_URL (for Supabase - single database)
 * 3. Individual connection parameters
 */
const getDbConfig = () => {
  // Check for service-specific DATABASE_URL first, then generic DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL_USERS || process.env.DATABASE_URL;
  
  if (databaseUrl) {
    // For Supabase, we need specific SSL settings to avoid certificate errors
    // with connection poolers. explicit ssl config overrides param but params might conflict
    if (databaseUrl.includes('supabase.co') || databaseUrl.includes('supabase.com')) {
      // Strip sslmode from URL if present to let the ssl object control configuration
      const cleanUrl = databaseUrl.replace(/(\?|&)sslmode=[^&]*/, '');
      return {
        connectionString: cleanUrl,
        ssl: { rejectUnauthorized: false }
      };
    }

    return {
      connectionString: databaseUrl,
    };
  }

  // Otherwise, use individual connection parameters
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ecommerce_users',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

module.exports = { getDbConfig };

