const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  let client;
  try {
    console.log('🌱 Seeding database with test data...');

    // Получаем клиент для транзакции
    client = await pool.connect();
    await client.query('BEGIN');

    // Генерируем правильный хеш для пароля "123456"
    const correctHash = await bcrypt.hash('123456', 10);
    console.log(`🔑 Generated hash: ${correctHash}`);

    // Очищаем таблицы в правильном порядке (с отключением constraints)
    console.log('🧹 Clearing existing data...');
    await client.query('DELETE FROM borov_vakhta_history');
    await client.query('DELETE FROM specialties');
    await client.query('DELETE FROM vakhtas');
    await client.query('DELETE FROM promocodes');
    await client.query('DELETE FROM borovs');
    await client.query('DELETE FROM slons');
    await client.query('DELETE FROM users');

    // Сбрасываем последовательности
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE slons_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE borovs_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE promocodes_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE vakhtas_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE specialties_id_seq RESTART WITH 1');

    // Вставляем пользователей
    console.log('👥 Inserting users...');
    await client.query(`
      INSERT INTO users (username, password_hash, email, role, created_at) VALUES
      ('admin', $1, 'admin@borovy.ru', 'admin', NOW()),
      ('slon1', $1, 'slon1@borovy.ru', 'slon', NOW()),
      ('borov1', $1, 'borov1@borovy.ru', 'borov', NOW())
    `, [correctHash]);

    // Вставляем слона
    console.log('🐘 Inserting slon...');
    await client.query(`
      INSERT INTO slons (user_id, name, contact_info, created_at) VALUES
      (2, 'Иван Слоноров', 'ivan@example.com', NOW())
    `);

    // Вставляем боровова
    console.log('🐗 Inserting borov...');
    await client.query(`
      INSERT INTO borovs (user_id, slon_id, name, phone, status, created_at) VALUES
      (3, 1, 'Петр Боровов', '+79991234567', 'active', NOW())
    `);

    // Вставляем промокод
    console.log('🎫 Inserting promo code...');
    await client.query(`
      INSERT INTO promocodes (code, slon_id, is_used, created_at) VALUES
      ('TEST2024', 1, false, NOW())
    `);

    // Вставляем вахту
    console.log('🏗️ Inserting vakhta...');
    await client.query(`
      INSERT INTO vakhtas (title, description, location, start_date, end_date, total_places, created_by_slon_id, created_at) VALUES
      ('Вахта на стройке', 'Работа на строительстве жилого комплекса', 'Москва', NOW() + INTERVAL '10 days', NOW() + INTERVAL '30 days', 10, 1, NOW())
    `);

    // Вставляем специальности
    console.log('🔧 Inserting specialties...');
    await client.query(`
      INSERT INTO specialties (vakhta_id, title, description, requirements, salary, total_places, current_workers) VALUES
      (1, 'Разнорабочий', 'Помощник на стройке', 'Физическая выносливость', 50000.00, 5, 0),
      (1, 'Сварщик', 'Работа со сварочным аппаратом', 'Опыт работы от 1 года', 80000.00, 2, 0)
    `);

    // Коммитим транзакцию
    await client.query('COMMIT');
    console.log('🎉 Database seeded successfully!');

    console.log('\n📝 Test credentials:');
    console.log('👤 Username: admin, Password: 123456');
    console.log('👤 Username: slon1, Password: 123456');
    console.log('👤 Username: borov1, Password: 123456');

  } catch (error) {
    // Откатываем транзакцию при ошибке
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('❌ Seeding error:', error);
  } finally {
    // Освобождаем клиент
    if (client) {
      client.release();
    }
    process.exit();
  }
}

seedDatabase();