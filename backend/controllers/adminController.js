const { pool } = require('../config/database');
const { hashPassword } = require('../utils/passwordHash');

// Slon management
const getAllSlons = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*,
             COUNT(DISTINCT pc.id) as promo_codes_count,
             COUNT(DISTINCT b.id) as borovs_count
      FROM slons s
      LEFT JOIN promo_codes pc ON s.id = pc.slon_id
      LEFT JOIN borovs b ON pc.id = b.promo_code_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all slons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Добавь эту функцию в adminController.js

// Получение вахт со специальностями
const getVakhtasWithSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.*,
        (SELECT COUNT(*) FROM borov_vakhta_history
         WHERE vakhta_id = v.id AND status = 'active') as current_workers,
        COALESCE(json_agg(
          json_build_object(
            'id', s.id,
            'title', s.title,
            'description', s.description,
            'requirements', s.requirements,
            'total_places', s.total_places,
            'salary', s.salary,
            'is_active', s.is_active,
            'current_workers', (SELECT COUNT(*) FROM borov_specialty_history
                              WHERE specialty_id = s.id AND status = 'active'),
            'free_places', s.total_places - (SELECT COUNT(*) FROM borov_specialty_history
                                           WHERE specialty_id = s.id AND status = 'active')
          ) ORDER BY s.created_at DESC
        ) FILTER (WHERE s.id IS NOT NULL), '[]') as specialties
      FROM vakhtas v
      LEFT JOIN specialties s ON v.id = s.vakhta_id AND s.is_active = true
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get vakhtas with specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSlon = async (req, res) => {
  try {
    console.log('Create slon request:', req.body);

    const { username, display_name, contact_phone, contact_email, password } = req.body;

    // ДЕТАЛЬНАЯ ВАЛИДАЦИЯ
    console.log('Validation check:');
    console.log('username:', username);
    console.log('display_name:', display_name);
    console.log('password:', password ? 'PRESENT' : 'MISSING');
    console.log('password length:', password?.length);

    if (!username || !display_name || !password) {
      return res.status(400).json({
        error: 'Username, display_name and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Проверяем существующего пользователя
    const existingUser = await pool.query(
      'SELECT id FROM slons WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    const result = await pool.query(
      `INSERT INTO slons (username, display_name, contact_phone, contact_email, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, display_name, contact_phone, contact_email, created_at`,
      [username, display_name, contact_phone, contact_email, hashedPassword]
    );

    console.log('Slon created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create slon error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
const getAllSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.location, v.is_active as vakhta_active,
             (SELECT COUNT(*) FROM borov_specialty_history
              WHERE specialty_id = s.id AND status = 'active') as current_workers,
             COUNT(bsh.id) as total_borovs
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      LEFT JOIN borov_specialty_history bsh ON s.id = bsh.specialty_id
      GROUP BY s.id, v.title, v.location, v.is_active
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Activity logs - логи действий боровов
const getBorovActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        bsh.*,
        b.full_name as borov_name,
        b.phone as borov_phone,
        s.title as specialty_title,
        v.title as vakhta_title,
        sl.display_name as slon_name
      FROM borov_specialty_history bsh
      JOIN borovs b ON bsh.borov_id = b.id
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN slons sl ON pc.slon_id = sl.id
      ORDER BY bsh.created_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get borov activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSlon = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, contact_phone, contact_email, is_active } = req.body;

    const result = await pool.query(
      `UPDATE slons
       SET display_name = $1, contact_phone = $2, contact_email = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, username, display_name, contact_phone, contact_email, is_active, created_at`,
      [display_name, contact_phone, contact_email, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update slon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Promo codes management
const getAllPromoCodes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pc.*, s.display_name as slon_name,
             COUNT(b.id) as borovs_count
      FROM promo_codes pc
      LEFT JOIN slons s ON pc.slon_id = s.id
      LEFT JOIN borovs b ON pc.id = b.promo_code_id
      GROUP BY pc.id, s.display_name
      ORDER BY pc.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all promo codes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Borovs management
const getAllBorovs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, pc.code as promo_code, s.display_name as slon_name,
             bs.total_vakhtas_completed, bs.total_work_days,
             v.title as current_vakhta
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN slons s ON pc.slon_id = s.id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      ORDER BY b.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all borovs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Vakhtas management
const getAllVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *,
             (SELECT COUNT(*) FROM borov_vakhta_history
              WHERE vakhta_id = vakhtas.id AND status = 'active') as current_workers
      FROM vakhtas
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createVakhta = async (req, res) => {
  try {
    console.log('Create vakhta request body:', req.body);

    const { title, description, location, total_places, start_date, end_date, requirements, conditions } = req.body;

    // Валидация обязательных полей
    if (!title || !location || !total_places || !start_date || !end_date) {
      return res.status(400).json({
        error: 'Missing required fields: title, location, total_places, start_date, end_date'
      });
    }

    // Преобразуем total_places в число
    const totalPlaces = parseInt(total_places);
    if (isNaN(totalPlaces) || totalPlaces < 1) {
      return res.status(400).json({ error: 'total_places must be a positive number' });
    }

    // Проверка дат
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (startDate <= new Date()) {
      return res.status(400).json({ error: 'Start date must be in the future' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const result = await pool.query(
      `INSERT INTO vakhtas (title, description, location, total_places, start_date, end_date, requirements, conditions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, location, totalPlaces, startDate, endDate, requirements, conditions]
    );

    console.log('Vakhta created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create vakhta error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

const updateVakhta = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, total_places, start_date, end_date, requirements, conditions, is_active } = req.body;

    const result = await pool.query(
      `UPDATE vakhtas
       SET title = $1, description = $2, location = $3, total_places = $4,
           start_date = $5, end_date = $6, requirements = $7, conditions = $8,
           is_active = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [title, description, location, total_places, start_date, end_date, requirements, conditions, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Добавь эту функцию в adminController.js
const createSpecialty = async (req, res) => {
  try {
    console.log('Create specialty request:', req.body);

    const { vakhta_id, title, description, requirements, total_places, salary } = req.body;

    // Детальная валидация
    if (!vakhta_id || !title || !total_places || !salary) {
      return res.status(400).json({
        error: 'Missing required fields: vakhta_id, title, total_places, salary'
      });
    }

    if (title.length < 2 || title.length > 200) {
      return res.status(400).json({
        error: 'Title must be between 2 and 200 characters'
      });
    }

    const totalPlaces = parseInt(total_places);
    if (isNaN(totalPlaces) || totalPlaces < 1 || totalPlaces > 100) {
      return res.status(400).json({
        error: 'Total places must be a number between 1 and 100'
      });
    }

    const salaryAmount = parseInt(salary);
    if (isNaN(salaryAmount) || salaryAmount < 1000 || salaryAmount > 50000) {
      return res.status(400).json({
        error: 'Salary must be a number between 1000 and 50000'
      });
    }

    // Проверяем существует ли вахта и активна ли она
    const vakhtaCheck = await pool.query(
      'SELECT id, title, is_active FROM vakhtas WHERE id = $1',
      [vakhta_id]
    );

    if (vakhtaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    const vakhta = vakhtaCheck.rows[0];
    if (!vakhta.is_active) {
      return res.status(400).json({
        error: 'Cannot create specialty for inactive vakhta'
      });
    }

    // Проверяем нет ли уже специальности с таким названием на этой вахте
    const existingSpecialty = await pool.query(
      'SELECT id FROM specialties WHERE vakhta_id = $1 AND title = $2 AND is_active = true',
      [vakhta_id, title]
    );

    if (existingSpecialty.rows.length > 0) {
      return res.status(400).json({
        error: 'Specialty with this name already exists for this vakhta'
      });
    }

    // Создаем специальность
    const result = await pool.query(
      `INSERT INTO specialties (vakhta_id, title, description, requirements, total_places, salary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [vakhta_id, title.trim(), description?.trim() || null, requirements?.trim() || null, totalPlaces, salaryAmount]
    );

    const createdSpecialty = result.rows[0];

    // Получаем полную информацию о созданной специальности для ответа
    const fullSpecialty = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.location,
             (SELECT COUNT(*) FROM borov_specialty_history
              WHERE specialty_id = s.id AND status = 'active') as current_workers
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.id = $1
    `, [createdSpecialty.id]);

    console.log('Specialty created successfully:', {
      id: createdSpecialty.id,
      title: createdSpecialty.title,
      vakhta: vakhta.title
    });

    res.status(201).json(fullSpecialty.rows[0]);

  } catch (error) {
    console.error('Create specialty error:', error);

    // Обработка специфических ошибок PostgreSQL
    if (error.code === '23503') { // foreign_key_violation
      return res.status(400).json({ error: 'Invalid vakhta_id' });
    }
    if (error.code === '23505') { // unique_violation
      return res.status(400).json({ error: 'Specialty with this name already exists' });
    }

    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
};

// Create promo code
const createPromoCode = async (req, res) => {
  try {
    console.log('Create promo code request:', req.body);

    const { code, description, slon_id } = req.body;

    if (!code || !slon_id) {
      return res.status(400).json({
        error: 'Missing required fields: code, slon_id'
      });
    }

    // Проверяем существует ли промокод
    const existingCode = await pool.query(
      'SELECT id FROM promo_codes WHERE code = $1',
      [code]
    );

    if (existingCode.rows.length > 0) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    // Проверяем существует ли слон
    const slonCheck = await pool.query(
      'SELECT id FROM slons WHERE id = $1',
      [slon_id]
    );

    if (slonCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    const result = await pool.query(
      `INSERT INTO promo_codes (slon_id, code, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [slon_id, code, description]
    );

    console.log('Promo code created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Statistics
const getAdminStats = async (req, res) => {
  try {
    const [
      slonsCount,
      borovsCount,
      vakhtasCount,
      activeVakhtasCount,
      promoCodesCount
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM slons WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM borovs'),
      pool.query('SELECT COUNT(*) FROM vakhtas'),
      pool.query('SELECT COUNT(*) FROM vakhtas WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM promo_codes WHERE is_active = true')
    ]);

    const weeklyRegistrations = await pool.query(`
      SELECT DATE_TRUNC('week', created_at) as week, COUNT(*) as count
      FROM borovs
      WHERE created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY week
      ORDER BY week
    `);

    res.json({
      slons: parseInt(slonsCount.rows[0].count),
      borovs: parseInt(borovsCount.rows[0].count),
      vakhtas: parseInt(vakhtasCount.rows[0].count),
      active_vakhtas: parseInt(activeVakhtasCount.rows[0].count),
      promo_codes: parseInt(promoCodesCount.rows[0].count),
      weekly_registrations: weeklyRegistrations.rows
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const [stats, slons, promocodes, borovs, vakhtas] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM slons WHERE is_active = true) as slons_count,
          (SELECT COUNT(*) FROM borovs) as borovs_count,
          (SELECT COUNT(*) FROM vakhtas) as vakhtas_count,
          (SELECT COUNT(*) FROM vakhtas WHERE is_active = true) as active_vakhtas_count,
          (SELECT COUNT(*) FROM promo_codes WHERE is_active = true) as promocodes_count
      `),
      pool.query(`
        SELECT s.*,
               COUNT(DISTINCT pc.id) as promo_codes_count,
               COUNT(DISTINCT b.id) as borovs_count
        FROM slons s
        LEFT JOIN promo_codes pc ON s.id = pc.slon_id
        LEFT JOIN borovs b ON pc.id = b.promo_code_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT 10
      `),
      pool.query(`
        SELECT pc.*, s.display_name as slon_name,
               COUNT(b.id) as borovs_count
        FROM promo_codes pc
        LEFT JOIN slons s ON pc.slon_id = s.id
        LEFT JOIN borovs b ON pc.id = b.promo_code_id
        GROUP BY pc.id, s.display_name
        ORDER BY pc.created_at DESC
        LIMIT 10
      `),
      pool.query(`
        SELECT b.*, pc.code as promo_code, s.display_name as slon_name
        FROM borovs b
        LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
        LEFT JOIN slons s ON pc.slon_id = s.id
        ORDER BY b.created_at DESC
        LIMIT 10
      `),
      pool.query(`
        SELECT *,
               (SELECT COUNT(*) FROM borov_vakhta_history
                WHERE vakhta_id = vakhtas.id AND status = 'active') as current_workers
        FROM vakhtas
        ORDER BY created_at DESC
        LIMIT 10
      `)
    ]);

    res.json({
      stats: stats.rows[0],
      slons: slons.rows,
      promocodes: promocodes.rows,
      borovs: borovs.rows,
      vakhtas: vakhtas.rows
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSlons,
  createSlon,
  updateSlon,
  getAllPromoCodes,
  createPromoCode,
  getAllBorovs,
  getAllVakhtas,
  createVakhta,
  updateVakhta,
  getAdminStats,
  getAdminDashboard,
  getAllSpecialties,
  getBorovActivity,
  getVakhtasWithSpecialties,
  createSpecialty
};