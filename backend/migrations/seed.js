require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Create default admin slon
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await pool.query(`
      INSERT INTO slons (username, display_name, password_hash, contact_phone, contact_email) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    `, ['admin', 'Администратор Системы', adminPassword, '+79990000000', 'admin@borovy.ru']);

    const adminId = adminResult.rows[0].id;
    console.log('✅ Admin slon created');

    // Create test slon
    const slonPassword = await bcrypt.hash('slon123', 12);
    const slonResult = await pool.query(`
      INSERT INTO slons (username, display_name, password_hash, contact_phone, contact_email) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    `, ['slon1', 'Иван Менеджеров', slonPassword, '+79991111111', 'slon1@borovy.ru']);

    const slonId = slonResult.rows[0].id;
    console.log('✅ Test slon created');

    // Create promo codes
    await pool.query(`
      INSERT INTO promo_codes (slon_id, code, description) 
      VALUES 
      ($1, 'SLON1_TIKTOK', 'Промокод для TikTok канала'),
      ($1, 'SLON1_INSTA', 'Промокод для Instagram')
    `, [slonId]);
    console.log('✅ Promo codes created');

    // Create sample vakhtas
    await pool.query(`
      INSERT INTO vakhtas (title, description, location, total_places, current_workers, start_date, end_date, requirements, conditions) 
      VALUES 
      ('Разнорабочий на склад', 'Работа на складе, погрузо-разгрузочные работы', 'Москва, склад №5', 20, 0, '2024-03-01', '2024-06-01', 'Физическая выносливость, ответственность', 'Общежитие, питание, 5000 руб/день'),
      ('Сборщик мебели', 'Сборка корпусной мебели на производстве', 'Московская область, г. Химки', 10, 0, '2024-03-15', '2024-05-15', 'Опыт работы приветствуется, внимательность', 'Общежитие, 6000 руб/день'),
      ('Упаковщик продукции', 'Фасовка и упаковка продуктов питания', 'Казань, завод №2', 15, 0, '2024-02-20', '2024-04-20', 'Аккуратность, скорость работы', 'Своя комната, 4500 руб/день')
    `);
    console.log('✅ Sample vakhtas created');

    console.log('🎉 Database seeded successfully!');
    console.log('Default admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nTest slon credentials:');
    console.log('Username: slon1');
    console.log('Password: slon123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedData();
