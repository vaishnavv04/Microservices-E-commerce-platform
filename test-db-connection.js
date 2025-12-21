/**
 * Test database connection script
 * Run with: node test-db-connection.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const testConnection = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('🔍 Testing database connection...');
  console.log('📍 Connection string:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  // Parse the connection string to check format
  try {
    const url = new URL(databaseUrl);
    console.log('✅ Connection string format is valid');
    console.log('   Host:', url.hostname);
    console.log('   Port:', url.port);
    console.log('   Database:', url.pathname.substring(1));
    console.log('   User:', url.username);
  } catch (error) {
    console.error('❌ Invalid connection string format:', error.message);
    process.exit(1);
  }

  // Test actual connection
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('   Server time:', result.rows[0].now);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check if your Supabase project is active');
      console.error('   2. Verify the hostname is correct');
      console.error('   3. Try pinging: db.qcohhojysvdrgscbczhj.supabase.co');
    } else if (error.code === '28P01') {
      console.error('\n💡 Password authentication failed:');
      console.error('   1. Check your database password');
      console.error('   2. Make sure special characters are URL-encoded');
      console.error('   3. Reset password in Supabase Dashboard > Database Settings');
    }
    
    await pool.end();
    process.exit(1);
  }
};

testConnection();



