require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const createTables = async () => {
  try {
    console.log('Starting database migration...');

    // Create slons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS slons (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(20),
        contact_email VARCHAR(100),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ slons table created');

    // Create promo_codes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        slon_id INTEGER REFERENCES slons(id) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(200),
        usage_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ promo_codes table created');

    // Create vakhtas table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vakhtas (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        location VARCHAR(200),
        total_places INTEGER NOT NULL,
        current_workers INTEGER DEFAULT 0,
        start_date DATE,
        end_date DATE,
        requirements TEXT,
        conditions TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ vakhtas table created');

    // Create borovs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borovs (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        birth_date DATE,
        promo_code_id INTEGER REFERENCES promo_codes(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ borovs table created');

    // Create borov_vakhta_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borov_vakhta_history (
        id SERIAL PRIMARY KEY,
        borov_id INTEGER REFERENCES borovs(id) NOT NULL,
        vakhta_id INTEGER REFERENCES vakhtas(id) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ borov_vakhta_history table created');

    // Create borov_stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borov_stats (
        borov_id INTEGER PRIMARY KEY REFERENCES borovs(id),
        total_vakhtas_completed INTEGER DEFAULT 0,
        total_work_days INTEGER DEFAULT 0,
        current_vakhta_id INTEGER REFERENCES vakhtas(id),
        last_updated TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ borov_stats table created');

    console.log('🎉 All tables created successfully!');
    // В migrate.js - добавьте после создания таблиц
    // Add indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vakhtas_active ON vakhtas (is_active, start_date) WHERE is_active = true;
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_borov_vakhta_active ON borov_vakhta_history (status, vakhta_id) WHERE status = 'active';
    `);
    console.log('✅ Performance indexes created');


  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};


createTables();
