import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const testConnection = async () => {
  console.log('🔍 Testing Database Connection...\n');

  const useConnectionString = Boolean(process.env.DATABASE_URL);
  console.log(`📍 Using connection method: ${useConnectionString ? 'CONNECTION STRING' : 'INDIVIDUAL VARS'}\n`);

  if (useConnectionString) {
    console.log(`📌 DATABASE_URL: ${process.env.DATABASE_URL.substring(0, 50)}...`);
    console.log(`🔒 DATABASE_SSL: ${process.env.DATABASE_SSL}\n`);
  } else {
    console.log(`📌 DB_HOST: ${process.env.DB_HOST}`);
    console.log(`📌 DB_USER: ${process.env.DB_USER}`);
    console.log(`📌 DB_NAME: ${process.env.DB_NAME}`);
    console.log(`📌 DB_PORT: ${process.env.DB_PORT || 5432}\n`);
  }

  const pool = useConnectionString
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'false'
          ? undefined
          : { rejectUnauthorized: false },
      })
    : new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      });

  try {
    console.log('⏳ Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!\n');

    // Test a simple query
    console.log('⏳ Testing query...');
    const result = await client.query('SELECT NOW()');
    console.log(`✅ Query successful! Server time: ${result.rows[0].now}\n`);

    // Check users table
    console.log('⏳ Checking users table...');
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users in DB: ${usersResult.rows[0].count}\n`);

    // Check startups table
    console.log('⏳ Checking startups table...');
    const startupsResult = await client.query('SELECT COUNT(*) as count FROM startups');
    console.log(`✅ Startups in DB: ${startupsResult.rows[0].count}\n`);

    client.release();
    console.log('🎉 All checks passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n📋 Error details:', error);
    process.exit(1);
  }
};

testConnection();
