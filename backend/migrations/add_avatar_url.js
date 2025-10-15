const { pool } = require('../config/database');

async function addAvatarUrlColumn() {
  try {
    console.log('Adding avatar_url column to borovs table...');

    await pool.query(`
      ALTER TABLE borovs
      ADD COLUMN IF NOT EXISTS avatar_url TEXT
    `);

    console.log('✅ avatar_url column added successfully');
  } catch (error) {
    console.error('❌ Error adding avatar_url column:', error);
    throw error;
  }
}

// Запуск миграции
addAvatarUrlColumn()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });