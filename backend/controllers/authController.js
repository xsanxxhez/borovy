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
    let additionalData = null;

    // Ищем пользователя в таблице users
    console.log('🔍 Checking users table...');
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      role = user.role;

      // Получаем дополнительные данные в зависимости от роли
      if (role === 'slon' || role === 'admin') {
        const slonResult = await pool.query(
          'SELECT * FROM slons WHERE user_id = $1',
          [user.id]
        );
        if (slonResult.rows.length > 0) {
          additionalData = slonResult.rows[0];
        }
      } else if (role === 'borov') {
        const borovResult = await pool.query(
          `SELECT b.*, pc.code as promo_code, s.name as slon_name
           FROM borovs b
           LEFT JOIN promocodes pc ON b.promo_code_id = pc.id
           LEFT JOIN slons s ON b.slon_id = s.id
           WHERE b.user_id = $1`,
          [user.id]
        );
        if (borovResult.rows.length > 0) {
          additionalData = borovResult.rows[0];
        }
      }

      console.log('✅ User found in users table, role:', role);
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

    // Prepare user response
    let userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      display_name: user.username
    };

    // Добавляем дополнительные данные в зависимости от роли
    if (additionalData) {
      if (role === 'slon' || role === 'admin') {
        userResponse.display_name = additionalData.name || user.username;
        userResponse.slon_id = additionalData.id;
        userResponse.contact_info = additionalData.contact_info;
      } else if (role === 'borov') {
        userResponse.display_name = additionalData.name || user.username;
        userResponse.borov_id = additionalData.id;
        userResponse.phone = additionalData.phone;
        userResponse.status = additionalData.status;
        userResponse.promo_code = additionalData.promo_code;
        userResponse.slon_name = additionalData.slon_name;
      }
    }

    // Generate token
    console.log('🎫 Generating token...');
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: role,
      display_name: userResponse.display_name
    });

    const responseData = {
      token,
      user: userResponse
    };

    console.log('✅ Login successful for:', userResponse.username, 'role:', userResponse.role);

    res.json(responseData);

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    // Получаем основные данные пользователя
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    let profileData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: req.user.role,
      created_at: user.created_at
    };

    // Получаем дополнительные данные в зависимости от роли
    if (req.user.role === 'slon' || req.user.role === 'admin') {
      const slonResult = await pool.query(
        'SELECT * FROM slons WHERE user_id = $1',
        [req.user.id]
      );
      if (slonResult.rows.length > 0) {
        const slon = slonResult.rows[0];
        profileData.display_name = slon.name;
        profileData.contact_info = slon.contact_info;
        profileData.slon_id = slon.id;
      }
    } else if (req.user.role === 'borov') {
      const borovResult = await pool.query(
        `SELECT b.*, pc.code as promo_code, s.name as slon_name
         FROM borovs b
         LEFT JOIN promocodes pc ON b.promo_code_id = pc.id
         LEFT JOIN slons s ON b.slon_id = s.id
         WHERE b.user_id = $1`,
        [req.user.id]
      );
      if (borovResult.rows.length > 0) {
        const borov = borovResult.rows[0];
        profileData.display_name = borov.name;
        profileData.phone = borov.phone;
        profileData.status = borov.status;
        profileData.borov_id = borov.id;
        profileData.promo_code = borov.promo_code;
        profileData.slon_name = borov.slon_name;
      }
    }

    res.json(profileData);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  getProfile
};