// sync-counters.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const syncVakhtaCounters = async () => {
  try {
    console.log('🔄 Syncing vakhta counters...');

    // Получаем все вахты
    const vakhtas = await pool.query('SELECT id, title FROM vakhtas');

    for (const vakhta of vakhtas.rows) {
      // Считаем реальное количество работников на самой вахте
      const vakhtaWorkers = await pool.query(
        'SELECT COUNT(*) FROM borov_vakhta_history WHERE vakhta_id = $1 AND status = $2',
        [vakhta.id, 'active']
      );

      // Считаем работников на специальностях этой вахты
      const specialtyWorkers = await pool.query(`
        SELECT COUNT(*) FROM borov_specialty_history bsh
        JOIN specialties s ON bsh.specialty_id = s.id
        WHERE s.vakhta_id = $1 AND bsh.status = $2
      `, [vakhta.id, 'active']);

      const totalWorkers = parseInt(vakhtaWorkers.rows[0].count) + parseInt(specialtyWorkers.rows[0].count);

      // Обновляем счетчик
      await pool.query(
        'UPDATE vakhtas SET current_workers = $1 WHERE id = $2',
        [totalWorkers, vakhta.id]
      );

      console.log(`✅ Vakhta "${vakhta.title}" (ID: ${vakhta.id}): ${totalWorkers} workers`);
    }

    console.log('🎉 Counters synced successfully!');
  } catch (error) {
    console.error('Error syncing counters:', error);
  } finally {
    await pool.end();
  }
};

// Запускаем синхронизацию
syncVakhtaCounters();