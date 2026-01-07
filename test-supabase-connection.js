require('dotenv').config();
const { Client } = require('pg');

async function testConnection(name, connectionString) {
  console.log(`Testing connection to ${name}...`);
  if (!connectionString) {
    console.error(`Error: No connection string found for ${name}`);
    return false;
  }
  
  // Mask password for logging
  const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log(`URL: ${maskedUrl}`);

  // Remove sslmode from URL to avoid conflicts with ssl object
  const cleanUrl = connectionString.replace(/(\?|&)sslmode=[^&]*/, '');
  
  const client = new Client({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase transaction poolers usually needing this or CA
  });

  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`✅ ${name} Connected! Server time: ${res.rows[0].now}`);
    await client.end();
    return true;
  } catch (err) {
    console.error(`❌ ${name} Failed:`, err.message);
    return false;
  }
}

async function main() {
  console.log('--- Database Connection Verification ---');
  
  const productsUrl = process.env.DATABASE_URL_PRODUCTS;
  const usersUrl = process.env.DATABASE_URL_USERS;

  const productsResult = await testConnection('Products Database', productsUrl);
  console.log('-----------------------------------');
  const usersResult = await testConnection('Users Database', usersUrl);
  
  if (productsResult && usersResult) {
    console.log('\n✅ All database connections successful!');
    process.exit(0);
  } else {
    console.error('\n❌ Some connections failed.');
    process.exit(1);
  }
}

main();
