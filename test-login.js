require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function test() {
  try {
    console.log('Testing database connection...');
    
    // Check if we can connect
    const client = await pool.connect();
    console.log('✅ Database connected');
    
    // Check if admin user exists
    const result = await client.query('SELECT * FROM slons WHERE username = $1', ['admin']);
    console.log('Admin user found:', result.rows.length > 0);
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('Admin data:', {
        id: admin.id,
        username: admin.username,
        password_hash: admin.password_hash ? 'HASHED' : 'MISSING'
      });
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
