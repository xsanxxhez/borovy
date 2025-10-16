const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');

    // Читаем SQL схему
    const schemaPath = path.join(__dirname, 'database_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Executing schema...');

    // Разделяем SQL на отдельные запросы
    const queries = schemaSQL.split(';').filter(query => query.trim());

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();
      if (query) {
        console.log(`📝 Executing query ${i + 1}/${queries.length}...`);
        try {
          await pool.query(query);
          console.log(`✅ Query ${i + 1} executed successfully`);
        } catch (error) {
          // Игнорируем ошибки "таблица уже существует"
          if (!error.message.includes('already exists')) {
            console.log(`⚠️  Query ${i + 1}: ${error.message}`);
          } else {
            console.log(`✅ Query ${i + 1} (table already exists)`);
          }
        }
      }
    }

    console.log('🎉 Migrations completed!');

    // Проверим, что таблицы создались
    console.log('\n📊 Checking created tables...');
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('✅ Available tables:');
    tablesResult.rows.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    process.exit();
  }
}

runMigrations();