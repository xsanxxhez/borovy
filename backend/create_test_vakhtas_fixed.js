require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const createTestVakhtas = async () => {
  try {
    console.log('🏗️ Creating test vakhtas...');

    // Удаляем старые тестовые вахты
    await pool.query("DELETE FROM vakhtas WHERE title LIKE 'Тестовая вахта%'");

    // Создаем новые тестовые вахты
    await pool.query(`
      INSERT INTO vakhtas (title, description, location, total_places, start_date, end_date, requirements, conditions)
      VALUES
      ('Разнорабочий на склад', 'Работа на складе, погрузо-разгрузочные работы', 'Москва, склад №5', 20, '2024-10-05', '2024-12-05', 'Физическая выносливость, ответственность', 'Общежитие, питание, 5000 руб/день'),
      ('Сборщик мебели', 'Сборка корпусной мебели на производстве', 'Московская область, г. Химки', 10, '2024-10-10', '2024-11-10', 'Опыт работы приветствуется, внимательность', 'Общежитие, 6000 руб/день'),
      ('Упаковщик продукции', 'Фасовка и упаковка продуктов питания', 'Казань, завод №2', 15, '2024-10-15', '2024-11-15', 'Аккуратность, скорость работы', 'Своя комната, 4500 руб/день')
    `);

    console.log('✅ Test vakhtas created successfully!');

    // Проверяем что вахты создались
    const result = await pool.query('SELECT * FROM vakhtas WHERE is_active = true');
    console.log(`📊 Active vakhtas in database: ${result.rows.length}`);
    result.rows.forEach(vakhta => {
      console.log(`   - ${vakhta.title} (${vakhta.location})`);
    });

  } catch (error) {
    console.error('❌ Error creating test vakhtas:', error);
  } finally {
    await pool.end();
  }
};

createTestVakhtas();