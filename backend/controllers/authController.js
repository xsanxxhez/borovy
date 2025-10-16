const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { pool } = require('../config/database');

const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt for:', req.body.username);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let user = null;
    let role = null;

    // Сначала проверяем админа (специальная логика для админа)
    if (username === 'admin') {
      console.log('🔍 Checking admin...');
      const adminResult = await pool.query(
        'SELECT * FROM slons WHERE username = $1',
        [username]
      );
      if (adminResult.rows.length > 0) {
        user = adminResult.rows[0];
        role = 'admin';
        console.log('✅ Admin found');
      }
    }

    // Если не админ, проверяем обычных слонов
    if (!user) {
      console.log('🔍 Checking slon...');
      const slonResult = await pool.query(
        'SELECT * FROM slons WHERE username = $1 AND is_active = true',
        [username]
      );
      if (slonResult.rows.length > 0) {
        user = slonResult.rows[0];
        role = 'slon';
        console.log('✅ Slon found');
      }
    }

    // Если не слон, проверяем боровов по email
    if (!user) {
      console.log('🔍 Checking borov by email...');
      const borovResult = await pool.query(
        'SELECT * FROM borovs WHERE email = $1',
        [username]
      );
      if (borovResult.rows.length > 0) {
        user = borovResult.rows[0];
        role = 'borov';
        console.log('✅ Borov found');
      }
    }

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    console.log('🔑 Verifying password...');
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    console.log('🎫 Generating token...');
    const token = generateToken({
      id: user.id,
      username: user.username || user.email,
      role: role,
      display_name: user.display_name || user.full_name
    });

    const responseData = {
      token,
      user: {
        id: user.id,
        username: user.username || user.email,
        role: role,
        display_name: user.display_name || user.full_name
      }
    };

    console.log('✅ Login successful for:', responseData.user.username, 'role:', responseData.user.role);

    res.json(responseData);

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    let user;

    if (req.user.role === 'slon' || req.user.role === 'admin') {
      const result = await pool.query(
        'SELECT id, username, display_name, contact_phone, contact_email, created_at FROM slons WHERE id = $1',
        [req.user.id]
      );
      user = result.rows[0];
    } else if (req.user.role === 'borov') {
      const result = await pool.query(
        `SELECT b.id, b.email, b.phone, b.full_name, b.birth_date, b.created_at,
                pc.code as promo_code, s.display_name as slon_name
         FROM borovs b
         LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
         LEFT JOIN slons s ON pc.slon_id = s.id
         WHERE b.id = $1`,
        [req.user.id]
      );
      user = result.rows[0];
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  getProfile
};