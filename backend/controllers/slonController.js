const { pool } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { generateCsv } = require('../utils/exportUtils');

// ==================== ПРОФИЛЬ СЛОНА ====================

const getSlonProfile = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, username, display_name, contact_phone, contact_email,
        is_active, created_at, updated_at
      FROM slons
      WHERE id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get slon profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSlonProfile = async (req, res) => {
  try {
    const { display_name, contact_phone, contact_email } = req.body;

    const result = await pool.query(`
      UPDATE slons
      SET display_name = $1, contact_phone = $2, contact_email = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, username, display_name, contact_phone, contact_email, created_at, updated_at
    `, [display_name, contact_phone, contact_email, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update slon profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Получаем текущий хеш пароля
    const slonResult = await pool.query(
      'SELECT password_hash FROM slons WHERE id = $1',
      [req.user.id]
    );

    if (slonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    const isValidPassword = await comparePassword(current_password, slonResult.rows[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(new_password);

    await pool.query(
      'UPDATE slons SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== ПРОМОКОДЫ ====================

const getMyPromoCodes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pc.*,
        COUNT(b.id) as borovs_count,
        COUNT(CASE WHEN bs.current_vakhta_id IS NOT NULL THEN 1 END) as active_borovs
      FROM promo_codes pc
      LEFT JOIN borovs b ON pc.id = b.promo_code_id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
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

    // Проверяем уникальность промокода
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

const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, is_active } = req.body;

    // Проверяем принадлежность промокода слону
    const promoCheck = await pool.query(
      'SELECT id FROM promo_codes WHERE id = $1 AND slon_id = $2',
      [id, req.user.id]
    );

    if (promoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found or access denied' });
    }

    // Проверяем уникальность нового кода
    if (code) {
      const existingCode = await pool.query(
        'SELECT id FROM promo_codes WHERE code = $1 AND id != $2',
        [code, id]
      );

      if (existingCode.rows.length > 0) {
        return res.status(400).json({ error: 'Promo code already exists' });
      }
    }

    const result = await pool.query(
      `UPDATE promo_codes
       SET code = COALESCE($1, code),
           description = COALESCE($2, description),
           is_active = COALESCE($3, is_active),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [code, description, is_active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем принадлежность промокода слону
    const promoCheck = await pool.query(
      'SELECT id FROM promo_codes WHERE id = $1 AND slon_id = $2',
      [id, req.user.id]
    );

    if (promoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found or access denied' });
    }

    // Проверяем есть ли зарегистрированные боровы с этим промокодом
    const borovsCheck = await pool.query(
      'SELECT COUNT(*) FROM borovs WHERE promo_code_id = $1',
      [id]
    );

    if (parseInt(borovsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete promo code with registered borovs. Deactivate it instead.'
      });
    }

    const result = await pool.query(
      'DELETE FROM promo_codes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== БОРОВЫ ====================

const getMyBorovs = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT
        b.*,
        pc.code as promo_code,
        bs.total_vakhtas_completed,
        bs.total_work_days,
        v.title as current_vakhta,
        s.title as current_specialty,
        CASE
          WHEN bs.current_vakhta_id IS NOT NULL THEN 'active'
          ELSE 'inactive'
        END as work_status
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      LEFT JOIN borov_specialty_history bsh ON b.id = bsh.borov_id AND bsh.status = 'active'
      LEFT JOIN specialties s ON bsh.specialty_id = s.id
      WHERE pc.slon_id = $1
    `;

    const params = [req.user.id];
    let paramCount = 1;

    if (status === 'active') {
      paramCount++;
      query += ` AND bs.current_vakhta_id IS NOT NULL`;
    } else if (status === 'inactive') {
      paramCount++;
      query += ` AND bs.current_vakhta_id IS NULL`;
    }

    if (search) {
      paramCount++;
      query += ` AND (b.full_name ILIKE $${paramCount} OR b.email ILIKE $${paramCount} OR b.phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get my borovs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBorovDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const borovResult = await pool.query(`
      SELECT
        b.*,
        pc.code as promo_code,
        bs.total_vakhtas_completed,
        bs.total_work_days,
        v.title as current_vakhta,
        s.title as current_specialty,
        v.start_date as vakhta_start_date,
        v.end_date as vakhta_end_date
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      LEFT JOIN borov_specialty_history bsh ON b.id = bsh.borov_id AND bsh.status = 'active'
      LEFT JOIN specialties s ON bsh.specialty_id = s.id
      WHERE b.id = $1 AND pc.slon_id = $2
    `, [id, req.user.id]);

    if (borovResult.rows.length === 0) {
      return res.status(404).json({ error: 'Borov not found or access denied' });
    }

    // Получаем историю вахт
    const vakhtaHistory = await pool.query(`
      SELECT
        bvh.*,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date
      FROM borov_vakhta_history bvh
      JOIN vakhtas v ON bvh.vakhta_id = v.id
      WHERE bvh.borov_id = $1
      ORDER BY bvh.created_at DESC
    `, [id]);

    // Получаем историю специальностей
    const specialtyHistory = await pool.query(`
      SELECT
        bsh.*,
        s.title as specialty_title,
        s.salary,
        v.title as vakhta_title,
        v.location
      FROM borov_specialty_history bsh
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE bsh.borov_id = $1
      ORDER BY bsh.created_at DESC
    `, [id]);

    res.json({
      ...borovResult.rows[0],
      vakhta_history: vakhtaHistory.rows,
      specialty_history: specialtyHistory.rows
    });
  } catch (error) {
    console.error('Get borov details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBorovStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Проверяем принадлежность борова слону
    const borovCheck = await pool.query(`
      SELECT b.id
      FROM borovs b
      JOIN promo_codes pc ON b.promo_code_id = pc.id
      WHERE b.id = $1 AND pc.slon_id = $2
    `, [id, req.user.id]);

    if (borovCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Borov not found or access denied' });
    }

    // Здесь можно добавить логику для изменения статуса боровов
    // Например, приостановление доступа и т.д.
    // Пока возвращаем сообщение о успешном обновлении

    res.json({
      message: 'Borov status updated successfully',
      borov_id: id,
      is_active: is_active
    });
  } catch (error) {
    console.error('Update borov status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const exportBorovsData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.full_name,
        b.email,
        b.phone,
        b.birth_date,
        b.created_at as registration_date,
        pc.code as promo_code,
        bs.total_vakhtas_completed,
        bs.total_work_days,
        v.title as current_vakhta,
        s.title as current_specialty,
        CASE
          WHEN bs.current_vakhta_id IS NOT NULL THEN 'Active'
          ELSE 'Inactive'
        END as status
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      LEFT JOIN borov_specialty_history bsh ON b.id = bsh.borov_id AND bsh.status = 'active'
      LEFT JOIN specialties s ON bsh.specialty_id = s.id
      WHERE pc.slon_id = $1
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    const csvData = generateCsv(result.rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=borovs_export.csv');
    res.send(csvData);
  } catch (error) {
    console.error('Export borovs data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== СТАТИСТИКА ====================

const getSlonStats = async (req, res) => {
  try {
    const slonId = req.user.id;

    const [
      promoCodesCount,
      borovsCount,
      activeBorovsCount,
      totalActivations,
      weeklyStats,
      promoEffectiveness
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
      `, [slonId]),
      pool.query(`
        SELECT DATE_TRUNC('week', b.created_at) as week, COUNT(*) as count
        FROM borovs b
        JOIN promo_codes pc ON b.promo_code_id = pc.id
        WHERE pc.slon_id = $1 AND b.created_at >= NOW() - INTERVAL '8 weeks'
        GROUP BY week
        ORDER BY week
      `, [slonId]),
      pool.query(`
        SELECT pc.code, pc.description, COUNT(b.id) as borovs_count
        FROM promo_codes pc
        LEFT JOIN borovs b ON pc.id = b.promo_code_id
        WHERE pc.slon_id = $1
        GROUP BY pc.id, pc.code, pc.description
        ORDER BY borovs_count DESC
      `, [slonId])
    ]);

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

const getCurrentWorkStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.title as vakhta_title,
        s.title as specialty_title,
        COUNT(b.id) as borovs_count,
        AVG(s.salary) as avg_salary
      FROM borovs b
      JOIN promo_codes pc ON b.promo_code_id = pc.id
      JOIN borov_stats bs ON b.id = bs.borov_id
      JOIN vakhtas v ON bs.current_vakhta_id = v.id
      JOIN borov_specialty_history bsh ON b.id = bsh.borov_id AND bsh.status = 'active'
      JOIN specialties s ON bsh.specialty_id = s.id
      WHERE pc.slon_id = $1
      GROUP BY v.title, s.title
      ORDER BY borovs_count DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get current work stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMySpecialtiesStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.title as specialty_title,
        v.title as vakhta_title,
        COUNT(bsh.id) as total_borovs,
        COUNT(CASE WHEN bsh.status = 'active' THEN 1 END) as active_borovs,
        AVG(s.salary) as avg_salary
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      JOIN borov_specialty_history bsh ON s.id = bsh.specialty_id
      JOIN borovs b ON bsh.borov_id = b.id
      JOIN promo_codes pc ON b.promo_code_id = pc.id
      WHERE pc.slon_id = $1
      GROUP BY s.title, v.title
      ORDER BY total_borovs DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my specialties stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyBorovActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        bsh.*,
        b.full_name as borov_name,
        b.phone as borov_phone,
        s.title as specialty_title,
        v.title as vakhta_title,
        pc.code as promo_code
      FROM borov_specialty_history bsh
      JOIN borovs b ON bsh.borov_id = b.id
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      JOIN promo_codes pc ON b.promo_code_id = pc.id
      WHERE pc.slon_id = $1
      ORDER BY bsh.created_at DESC
      LIMIT 50
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my borov activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ==================== ВАХТЫ ====================

const getMyVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        v.*,
        (SELECT COUNT(*) FROM borov_vakhta_history
         WHERE vakhta_id = v.id AND status = 'active') as current_workers,
        (SELECT COUNT(*) FROM borovs b
         JOIN promo_codes pc ON b.promo_code_id = pc.id
         JOIN borov_stats bs ON b.id = bs.borov_id
         WHERE bs.current_vakhta_id = v.id AND pc.slon_id = $1) as my_borovs_count
      FROM vakhtas v
      JOIN specialties s ON v.id = s.vakhta_id
      JOIN borov_specialty_history bsh ON s.id = bsh.specialty_id
      JOIN borovs b ON bsh.borov_id = b.id
      JOIN promo_codes pc ON b.promo_code_id = pc.id
      WHERE pc.slon_id = $1 AND v.is_active = true
      ORDER BY v.start_date DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // Профиль
  getSlonProfile,
  updateSlonProfile,
  changePassword,

  // Промокоды
  getMyPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,

  // Боровы
  getMyBorovs,
  getBorovDetails,
  updateBorovStatus,
  exportBorovsData,

  // Статистика
  getSlonStats,
  getCurrentWorkStats,
  getMySpecialtiesStats,
  getMyBorovActivity,

  // Вахты
  getMyVakhtas
};