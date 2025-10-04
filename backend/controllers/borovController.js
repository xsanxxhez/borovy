const { pool } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordHash');

const register = async (req, res) => {
  try {
    const { email, phone, password, full_name, birth_date, promo_code } = req.body;

    const existingUser = await pool.query(
      'SELECT id FROM borovs WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    const promoResult = await pool.query(
      'SELECT id, slon_id FROM promo_codes WHERE code = $1 AND is_active = true',
      [promo_code]
    );

    if (promoResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid promo code' });
    }

    const promoCodeId = promoResult.rows[0].id;
    const hashedPassword = await hashPassword(password);

    const borovResult = await pool.query(
      `INSERT INTO borovs (email, phone, password_hash, full_name, birth_date, promo_code_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, phone, full_name, birth_date, created_at`,
      [email, phone, hashedPassword, full_name, birth_date, promoCodeId]
    );

    await pool.query(
      'INSERT INTO borov_stats (borov_id) VALUES ($1)',
      [borovResult.rows[0].id]
    );

    await pool.query(
      'UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = $1',
      [promoCodeId]
    );

    res.status(201).json(borovResult.rows[0]);
  } catch (error) {
    console.error('Borov registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ИСПРАВЛЕННЫЕ SQL ЗАПРОСЫ
const getAvailableVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *,
             (SELECT COUNT(*) FROM borov_vakhta_history
              WHERE vakhta_id = vakhtas.id AND status = 'active') as current_workers,
             total_places - (SELECT COUNT(*) FROM borov_vakhta_history
                           WHERE vakhta_id = vakhtas.id AND status = 'active') as free_places
      FROM vakhtas
      WHERE is_active = true
        AND start_date > NOW()
        AND total_places > (SELECT COUNT(*) FROM borov_vakhta_history
                          WHERE vakhta_id = vakhtas.id AND status = 'active')
      ORDER BY start_date ASC
    `);

    const vakhtas = result.rows.map(vakhta => ({
      ...vakhta,
      free_places: Math.max(0, vakhta.free_places)
    }));

    res.json(vakhtas);
  } catch (error) {
    console.error('Get available vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const joinVakhta = async (req, res) => {
  try {
    const { vakhta_id } = req.body;
    const borov_id = req.user.id;

    const vakhtaResult = await pool.query(`
      SELECT *,
             (SELECT COUNT(*) FROM borov_vakhta_history
              WHERE vakhta_id = $1 AND status = 'active') as current_workers
      FROM vakhtas
      WHERE id = $1 AND is_active = true
    `, [vakhta_id]);

    if (vakhtaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vakhta not found or not active' });
    }

    const vakhta = vakhtaResult.rows[0];
    if (vakhta.current_workers >= vakhta.total_places) {
      return res.status(400).json({ error: 'No free places available' });
    }

    const activeVakhtaResult = await pool.query(
      'SELECT id FROM borov_vakhta_history WHERE borov_id = $1 AND status = $2',
      [borov_id, 'active']
    );

    if (activeVakhtaResult.rows.length > 0) {
      return res.status(400).json({ error: 'You already have an active vakhta' });
    }

    await pool.query(
      `INSERT INTO borov_vakhta_history (borov_id, vakhta_id, start_date, status)
       VALUES ($1, $2, $3, 'active')`,
      [borov_id, vakhta_id, vakhta.start_date]
    );

    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = $1 WHERE borov_id = $2',
      [vakhta_id, borov_id]
    );

    res.json({ message: 'Successfully joined vakhta' });
  } catch (error) {
    console.error('Join vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAvailableSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.location, v.start_date, v.end_date,
             s.total_places - (SELECT COUNT(*) FROM borov_specialty_history
                             WHERE specialty_id = s.id AND status = 'active') as free_places
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.is_active = true
        AND v.is_active = true
        AND v.start_date > NOW()
        AND s.total_places > (SELECT COUNT(*) FROM borov_specialty_history
                            WHERE specialty_id = s.id AND status = 'active')
      ORDER BY v.start_date ASC, s.title ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get available specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const joinSpecialty = async (req, res) => {
  try {
    const { specialty_id } = req.body;
    const borov_id = req.user.id;

    const specialtyResult = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.start_date,
             (SELECT COUNT(*) FROM borov_specialty_history
              WHERE specialty_id = $1 AND status = 'active') as current_workers
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.id = $1 AND s.is_active = true AND v.is_active = true
    `, [specialty_id]);

    if (specialtyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Specialty not found or not active' });
    }

    const specialty = specialtyResult.rows[0];
    if (specialty.current_workers >= specialty.total_places) {
      return res.status(400).json({ error: 'No free places available for this specialty' });
    }

    const activeSpecialtyResult = await pool.query(
      `SELECT bsh.id, s.title
       FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE bsh.borov_id = $1 AND bsh.status = 'active'`,
      [borov_id]
    );

    if (activeSpecialtyResult.rows.length > 0) {
      return res.status(400).json({
        error: `You already have an active specialty: ${activeSpecialtyResult.rows[0].title}`
      });
    }

    await pool.query(
      `INSERT INTO borov_specialty_history (borov_id, specialty_id, start_date, status)
       VALUES ($1, $2, $3, 'active')`,
      [borov_id, specialty_id, specialty.start_date]
    );

    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = $1 WHERE borov_id = $2',
      [specialty.vakhta_id, borov_id]
    );

    res.json({
      message: `Successfully joined specialty: ${specialty.title}`,
      specialty: specialty.title,
      vakhta: specialty.vakhta_title
    });
  } catch (error) {
    console.error('Join specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMySpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bsh.*, s.title as specialty_title, s.salary,
             v.title as vakhta_title, v.location,
             bsh.start_date, bsh.end_date, bsh.status, bsh.created_at as joined_at
      FROM borov_specialty_history bsh
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE bsh.borov_id = $1
      ORDER BY bsh.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, bvh.start_date, bvh.end_date, bvh.status, bvh.created_at as joined_at
      FROM borov_vakhta_history bvh
      JOIN vakhtas v ON bvh.vakhta_id = v.id
      WHERE bvh.borov_id = $1
      ORDER BY bvh.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBorovStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bs.*, v.title as current_vakhta_title
      FROM borov_stats bs
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      WHERE bs.borov_id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stats not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get borov stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const borov_id = req.user.id;

    const borovResult = await pool.query(
      'SELECT password_hash FROM borovs WHERE id = $1',
      [borov_id]
    );

    if (borovResult.rows.length === 0) {
      return res.status(404).json({ error: 'Borov not found' });
    }

    const isValidPassword = await comparePassword(current_password, borovResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(new_password);

    await pool.query(
      'UPDATE borovs SET password_hash = $1 WHERE id = $2',
      [hashedPassword, borov_id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  getAvailableVakhtas,
  joinVakhta,
  getMyVakhtas,
  getBorovStats,
  changePassword,
  getAvailableSpecialties,
  joinSpecialty,
  getMySpecialties
};