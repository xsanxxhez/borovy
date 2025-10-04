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

const createSlon = async (req, res) => {
  try {
    const { username, display_name, contact_phone, contact_email, password } = req.body;

    // Check if username exists
    const existingUser = await pool.query(
      'SELECT id FROM slons WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password || 'default123');

    const result = await pool.query(
      `INSERT INTO slons (username, display_name, contact_phone, contact_email, password_hash) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, username, display_name, contact_phone, contact_email, created_at`,
      [username, display_name, contact_phone, contact_email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create slon error:', error);
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
// В функции getAllVakhtas исправляем SQL запрос
const getAllVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *,
             (SELECT COUNT(*) FROM borov_vakhta_history
              WHERE vacancy_id = vakhtas.id AND status = 'active') as current_workers
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
    const { title, description, location, total_places, start_date, end_date, requirements, conditions } = req.body;

    // Валидация обязательных полей
    if (!title || !location || !total_places || !start_date || !end_date) {
      return res.status(400).json({
        error: 'Missing required fields: title, location, total_places, start_date, end_date'
      });
    }

    // Преобразование дат в правильный формат
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
      [title, description, location, parseInt(total_places), startDate, endDate, requirements, conditions]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    // Weekly registrations
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

// Admin-specific: Get all data for dashboard
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
  getAllBorovs,
  getAllVakhtas,
  createVakhta,
  updateVakhta,
  getAdminStats,
  getAdminDashboard
};
