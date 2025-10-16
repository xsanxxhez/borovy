const { Pool } = require('pg');

const getConfig = () => {
  if (process.env.DATABASE_URL) {
    console.log('✅ Using Transaction Pooler database connection');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }

  // Локальная разработка
  console.log('✅ Using local database');
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'borovy',
    user: process.env.DB_USER || 'borovy_user',
    password: process.env.DB_PASSWORD || 'borovy_password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
};

const pool = new Pool(getConfig());

// Функция для тестирования подключения
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

testConnection();

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection
};