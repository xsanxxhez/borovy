const { pool } = require('../config/database');

// Promo codes management for slon
const getMyPromoCodes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pc.*, COUNT(b.id) as borovs_count
      FROM promo_codes pc
      LEFT JOIN borovs b ON pc.id = b.promo_code_id
      WHERE pc.slon_id = $1
      GROUP BY pc.id
      ORDER BY pc.created_at DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get my promo codes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createPromoCode = async (req, res) => {
  try {
    const { code, description } = req.body;

    // Check if promo code exists
    const existingCode = await pool.query(
      'SELECT id FROM promo_codes WHERE code = $1',
      [code]
    );

    if (existingCode.rows.length > 0) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }

    const result = await pool.query(
      `INSERT INTO promo_codes (slon_id, code, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [req.user.id, code, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Borovs management for slon
// В функции getMyBorovs исправляем SQL запрос
const getMyBorovs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, pc.code as promo_code,
             bs.total_vakhtas_completed, bs.total_work_days,
             v.title as current_vakhta,
             CASE WHEN COALESCE(bs.current_vakhta_id, bs.current_vacancy_id) IS NOT NULL THEN true ELSE false END as is_active
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN vakhtas v ON COALESCE(bs.current_vakhta_id, bs.current_vacancy_id) = v.id
      WHERE pc.slon_id = $1
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my borovs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Statistics for slon
const getSlonStats = async (req, res) => {
  try {
    const slonId = req.user.id;

    const [
      promoCodesCount,
      borovsCount,
      activeBorovsCount,
      totalActivations
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM promo_codes WHERE slon_id = $1 AND is_active = true', [slonId]),
      pool.query(`
        SELECT COUNT(*) FROM borovs b 
        JOIN promo_codes pc ON b.promo_code_id = pc.id 
        WHERE pc.slon_id = $1
      `, [slonId]),
      pool.query(`
        SELECT COUNT(*) FROM borovs b 
        JOIN promo_codes pc ON b.promo_code_id = pc.id 
        JOIN borov_stats bs ON b.id = bs.borov_id 
        WHERE pc.slon_id = $1 AND bs.current_vakhta_id IS NOT NULL
      `, [slonId]),
      pool.query(`
        SELECT COUNT(*) FROM borovs b 
        JOIN promo_codes pc ON b.promo_code_id = pc.id 
        WHERE pc.slon_id = $1
      `, [slonId])
    ]);

    // Weekly stats
    const weeklyStats = await pool.query(`
      SELECT DATE_TRUNC('week', b.created_at) as week, COUNT(*) as count
      FROM borovs b 
      JOIN promo_codes pc ON b.promo_code_id = pc.id 
      WHERE pc.slon_id = $1 AND b.created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY week 
      ORDER BY week
    `, [slonId]);

    // Promo code effectiveness
    const promoEffectiveness = await pool.query(`
      SELECT pc.code, pc.description, COUNT(b.id) as borovs_count
      FROM promo_codes pc
      LEFT JOIN borovs b ON pc.id = b.promo_code_id
      WHERE pc.slon_id = $1
      GROUP BY pc.id, pc.code, pc.description
      ORDER BY borovs_count DESC
    `, [slonId]);

    res.json({
      promo_codes: parseInt(promoCodesCount.rows[0].count),
      total_borovs: parseInt(borovsCount.rows[0].count),
      active_borovs: parseInt(activeBorovsCount.rows[0].count),
      total_activations: parseInt(totalActivations.rows[0].count),
      weekly_stats: weeklyStats.rows,
      promo_effectiveness: promoEffectiveness.rows
    });
  } catch (error) {
    console.error('Get slon stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMyPromoCodes,
  createPromoCode,
  getMyBorovs,
  getSlonStats
};
