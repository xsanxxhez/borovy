require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const fixDatabase = async () => {
  try {
    console.log('🛠️ Fixing database structure...');

    // 1. Проверяем и добавляем current_vakhta_id в borov_stats
    const statsCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'borov_stats' AND column_name = 'current_vakhta_id'
    `);

    if (statsCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE borov_stats
        ADD COLUMN current_vakhta_id INTEGER REFERENCES vakhtas(id)
      `);
      console.log('✅ Added current_vakhta_id to borov_stats');
    } else {
      console.log('✅ current_vakhta_id already exists in borov_stats');
    }

    // 2. Проверяем структуру borov_vakhta_history
    const historyCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'borov_vakhta_history' AND column_name = 'vakhta_id'
    `);

    if (historyCheck.rows.length === 0) {
      console.log('❌ Column vakhta_id does not exist in borov_vakhta_history');
      console.log('Creating the column...');

      await pool.query(`
        ALTER TABLE borov_vakhta_history
        ADD COLUMN vakhta_id INTEGER REFERENCES vakhtas(id)
      `);
      console.log('✅ Added vakhta_id to borov_vakhta_history');

      // Если есть данные, нужно их перенести
      const hasData = await pool.query('SELECT COUNT(*) FROM borov_vakhta_history');
      if (parseInt(hasData.rows[0].count) > 0) {
        console.log('⚠️  Table has data, you may need to update vakhta_id values');
      }
    } else {
      console.log('✅ vakhta_id already exists in borov_vakhta_history');
    }

    // 3. Добавляем status если нет
    const statusCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'borov_vakhta_history' AND column_name = 'status'
    `);

    if (statusCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE borov_vakhta_history
        ADD COLUMN status VARCHAR(20) DEFAULT 'active'
      `);
      console.log('✅ Added status to borov_vakhta_history');
    } else {
      console.log('✅ status already exists in borov_vakhta_history');
    }

    // 4. Создаем индексы
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_borov_vakhta_history_status
      ON borov_vakhta_history(status)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_borov_vakhta_history_vakhta_id
      ON borov_vakhta_history(vakhta_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_vakhtas_active
      ON vakhtas (is_active, start_date) WHERE is_active = true
    `);

    console.log('✅ Created indexes');

    console.log('🎉 Database structure fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await pool.end();
  }
};

fixDatabase();