const { Pool } = require('pg');
const { getDbConfig } = require('./dbConfig');

const pool = new Pool(getDbConfig());

const initDatabase = async () => {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('Database tables initialized');
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.error('❌ Database connection failed: Hostname not found');
      console.error('   This usually means:');
      console.error('   1. Your Supabase project might be paused (free tier pauses after inactivity)');
      console.error('   2. The hostname in DATABASE_URL might be incorrect');
      console.error('   3. Check your Supabase dashboard: https://supabase.com/dashboard');
      console.error('   4. If paused, click "Restore" to wake up your project');
      console.error(`   Hostname: ${error.hostname || 'unknown'}`);
    } else {
      console.error('Database initialization error:', error.message);
    }
    throw error;
  }
};

module.exports = {
  pool,
  initDatabase,
};

