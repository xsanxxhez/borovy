const { pool } = require('./config/database');

async function checkPasswords() {
  try {
    console.log('🔍 Checking current passwords in database...');

    const result = await pool.query(`
      SELECT username, password_hash, role
      FROM users
      ORDER BY role
    `);

    console.log('\n📋 Current users in database:');
    result.rows.forEach(user => {
      console.log(`👤 ${user.username} (${user.role}): ${user.password_hash}`);
    });

    // Проверим длину хешей
    console.log('\n📏 Hash lengths:');
    result.rows.forEach(user => {
      console.log(`🔢 ${user.username}: ${user.password_hash.length} chars`);
    });

  } catch (error) {
    console.error('❌ Error checking passwords:', error);
  } finally {
    process.exit();
  }
}

checkPasswords();