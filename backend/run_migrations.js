require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const runMigrations = async () => {
  try {
    console.log('🚀 Running migrations...');

    // Создаем таблицу specialties
    await pool.query(`
      CREATE TABLE IF NOT EXISTS specialties (
        id SERIAL PRIMARY KEY,
        vakhta_id INTEGER REFERENCES vakhtas(id) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        requirements TEXT,
        total_places INTEGER NOT NULL,
        current_workers INTEGER DEFAULT 0,
        salary INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ specialties table created');

    // Создаем таблицу для истории записей на специальности
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borov_specialty_history (
        id SERIAL PRIMARY KEY,
        borov_id INTEGER REFERENCES borovs(id) NOT NULL,
        specialty_id INTEGER REFERENCES specialties(id) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ borov_specialty_history table created');

    // Создаем индексы
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_specialties_vakhta_id ON specialties(vakhta_id);
      CREATE INDEX IF NOT EXISTS idx_specialties_active ON specialties(is_active) WHERE is_active = true;
      CREATE INDEX IF NOT EXISTS idx_borov_specialty_borov_id ON borov_specialty_history(borov_id);
      CREATE INDEX IF NOT EXISTS idx_borov_specialty_specialty_id ON borov_specialty_history(specialty_id);
      CREATE INDEX IF NOT EXISTS idx_borov_specialty_status ON borov_specialty_history(status);
    `);
    console.log('✅ Specialties indexes created');

    console.log('🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();