const { Pool } = require('pg');

// Определяем конфигурацию в зависимости от окружения
const getConfig = () => {
  // Если есть DATABASE_URL (продакшен на Vercel + Supabase)
  if (process.env.DATABASE_URL) {
    console.log('✅ Using production database (Supabase)');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Увеличиваем таймаут для облака
    };
  }

  // Если есть POSTGRES_URL (альтернативная переменная)
  if (process.env.POSTGRES_URL) {
    console.log('✅ Using production database (Postgres URL)');
    return {
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20,
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

// Тестируем подключение при старте
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Функция для тестирования подключения
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database test query successful');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database test query failed:', error.message);
    return false;
  }
};

// Тестируем при импорте модуля
testConnection();

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection
};