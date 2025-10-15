// sync-counters.js - скрипт для исправления счетчиков
const syncVakhtaCounters = async () => {
  try {
    console.log('🔄 Syncing vakhta counters...');

    // Получаем все вахты
    const vakhtas = await pool.query('SELECT id FROM vakhtas');

    for (const vakhta of vakhtas.rows) {
      // Считаем реальное количество работников
      const vakhtaWorkers = await pool.query(
        'SELECT COUNT(*) FROM borov_vakhta_history WHERE vakhta_id = $1 AND status = $2',
        [vakhta.id, 'active']
      );

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

      console.log(`✅ Vakhta ${vakhta.id}: ${totalWorkers} workers`);
    }

    console.log('🎉 Counters synced successfully!');
  } catch (error) {
    console.error('Error syncing counters:', error);
  }
};

// Запустить один раз для исправления данных
// syncVakhtaCounters();