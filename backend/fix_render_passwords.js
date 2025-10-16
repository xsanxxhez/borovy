const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function fixRenderPasswords() {
  try {
    console.log('🔧 Fixing passwords on Render...');

    const correctHash = await bcrypt.hash('123456', 10);
    console.log(`🔑 New hash: ${correctHash}`);

    // Просто обновляем пароли существующих пользователей
    await pool.query(`
      UPDATE users SET password_hash = $1
      WHERE username IN ('admin', 'slon1', 'borov1')
    `, [correctHash]);

    console.log('✅ Passwords updated successfully!');
    console.log('🔑 All test users now have password: 123456');

  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
  } finally {
    process.exit();
  }
}

fixRenderPasswords();