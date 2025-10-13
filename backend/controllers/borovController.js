
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

// НОВЫЕ МЕТОДЫ ДЛЯ АНКЕТЫ БОРОВА

// Получение анкеты борова
const getBorovProfile = async (req, res) => {
  try {
    const borov_id = req.user.id;

    const result = await pool.query(`
      SELECT
        b.*,
        bs.*,
        json_build_object(
          'about_me', bp.about_me,
          'specialization', bp.specialization,
          'experience_years', bp.experience_years,
          'experience_description', bp.experience_description,
          'driver_license_category', bp.driver_license_category,
          'languages', bp.languages,
          'skills', bp.skills,
          'education', bp.education,
          'certifications', bp.certifications,
          'preferred_work_types', bp.preferred_work_types,
          'work_radius', bp.work_radius,
          'has_car', bp.has_car,
          'has_tools', bp.has_tools,
          'salary_expectations', bp.salary_expectations,
          'updated_at', bp.updated_at
        ) as profile
      FROM borovs b
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      LEFT JOIN borov_profiles bp ON b.id = bp.borov_id
      WHERE b.id = $1
    `, [borov_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Borov not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get borov profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Создание/обновление анкеты
const updateBorovProfile = async (req, res) => {
  try {
    const borov_id = req.user.id;
    const {
      about_me,
      specialization,
      experience_years,
      experience_description,
      driver_license_category,
      languages,
      skills,
      education,
      certifications,
      preferred_work_types,
      work_radius,
      has_car,
      has_tools,
      salary_expectations
    } = req.body;

    // Проверяем существование анкеты
    const existingProfile = await pool.query(
      'SELECT id FROM borov_profiles WHERE borov_id = $1',
      [borov_id]
    );

    let result;

    if (existingProfile.rows.length > 0) {
      // Обновляем существующую анкету
      result = await pool.query(`
        UPDATE borov_profiles
        SET
          about_me = $1,
          specialization = $2,
          experience_years = $3,
          experience_description = $4,
          driver_license_category = $5,
          languages = $6,
          skills = $7,
          education = $8,
          certifications = $9,
          preferred_work_types = $10,
          work_radius = $11,
          has_car = $12,
          has_tools = $13,
          salary_expectations = $14,
          updated_at = NOW()
        WHERE borov_id = $15
        RETURNING *
      `, [
        about_me, specialization, experience_years, experience_description,
        driver_license_category, languages, skills, education, certifications,
        preferred_work_types, work_radius, has_car, has_tools, salary_expectations, borov_id
      ]);
    } else {
      // Создаем новую анкету
      result = await pool.query(`
        INSERT INTO borov_profiles (
          borov_id, about_me, specialization, experience_years, experience_description,
          driver_license_category, languages, skills, education, certifications,
          preferred_work_types, work_radius, has_car, has_tools, salary_expectations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        borov_id, about_me, specialization, experience_years, experience_description,
        driver_license_category, languages, skills, education, certifications,
        preferred_work_types, work_radius, has_car, has_tools, salary_expectations
      ]);
    }

    res.json({
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Update borov profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Получение публичной анкеты
const getPublicProfile = async (req, res) => {
  try {
    const { borov_id } = req.params;

    const result = await pool.query(`
      SELECT
        b.full_name,
        b.email,
        b.phone,
        bp.about_me,
        bp.specialization,
        bp.experience_years,
        bp.experience_description,
        bp.driver_license_category,
        bp.languages,
        bp.skills,
        bp.education,
        bp.certifications,
        bp.preferred_work_types,
        bp.work_radius,
        bp.has_car,
        bp.has_tools,
        bp.salary_expectations,
        bp.updated_at,
        bs.total_vakhtas_completed,
        bs.total_work_days
      FROM borovs b
      LEFT JOIN borov_profiles bp ON b.id = bp.borov_id
      LEFT JOIN borov_stats bs ON b.id = bs.borov_id
      WHERE b.id = $1 AND b.is_active = true
    `, [borov_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// УЛУЧШЕННЫЙ МЕТОД ДЛЯ ПОЛУЧЕНИЯ ДОСТУПНЫХ ВАХТ
const getAvailableVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.*,
        (SELECT COUNT(*) FROM borov_vakhta_history
         WHERE vakhta_id = v.id AND status = 'active') as current_workers,
        v.total_places - (SELECT COUNT(*) FROM borov_vakhta_history
                        WHERE vakhta_id = v.id AND status = 'active') as free_places,
        EXISTS(
          SELECT 1 FROM borov_vakhta_history
          WHERE borov_id = $1 AND vakhta_id = v.id AND status = 'active'
        ) as is_joined
      FROM vakhtas v
      WHERE v.is_active = true
        AND v.start_date > NOW()
        AND v.total_places > (SELECT COUNT(*) FROM borov_vakhta_history
                            WHERE vakhta_id = v.id AND status = 'active')
      ORDER BY v.start_date ASC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get available vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ ЗАПИСИ НА ВАХТУ
const joinVakhta = async (req, res) => {
  try {
    const { vakhta_id } = req.body;
    const borov_id = req.user.id;

    // Проверяем существование вахты
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

    // Проверяем свободные места
    if (vakhta.current_workers >= vakhta.total_places) {
      return res.status(400).json({ error: 'No free places available' });
    }

    // Проверяем активные вахты
    const activeVakhtaResult = await pool.query(
      `SELECT id, vakhta_id FROM borov_vakhta_history
       WHERE borov_id = $1 AND status = 'active'`,
      [borov_id]
    );

    if (activeVakhtaResult.rows.length > 0) {
      return res.status(400).json({
        error: 'You already have an active vakhta',
        active_vakhta_id: activeVakhtaResult.rows[0].vakhta_id
      });
    }

    // Записываем на вахту
    await pool.query(
      `INSERT INTO borov_vakhta_history (borov_id, vakhta_id, start_date, status)
       VALUES ($1, $2, $3, 'active')`,
      [borov_id, vakhta_id, vakhta.start_date]
    );

    // Обновляем статистику
    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = $1 WHERE borov_id = $2',
      [vakhta_id, borov_id]
    );

    res.json({
      message: 'Successfully joined vakhta',
      vakhta: {
        id: vakhta.id,
        title: vakhta.title,
        start_date: vakhta.start_date
      }
    });
  } catch (error) {
    console.error('Join vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// НОВЫЙ МЕТОД ДЛЯ ВЫХОДА С ВАХТЫ
const leaveVakhta = async (req, res) => {
  try {
    const borov_id = req.user.id;

    // Находим активную вахту
    const activeVakhta = await pool.query(
      `SELECT bvh.id, bvh.vakhta_id, v.title
       FROM borov_vakhta_history bvh
       JOIN vakhtas v ON bvh.vakhta_id = v.id
       WHERE bvh.borov_id = $1 AND bvh.status = 'active'`,
      [borov_id]
    );

    if (activeVakhta.rows.length === 0) {
      return res.status(400).json({ error: 'No active vakhta found' });
    }

    // Обновляем статус на 'completed'
    await pool.query(
      `UPDATE borov_vakhta_history
       SET status = 'completed', end_date = NOW()
       WHERE id = $1`,
      [activeVakhta.rows[0].id]
    );

    // Обновляем статистику
    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = NULL WHERE borov_id = $1',
      [borov_id]
    );

    res.json({
      message: 'Successfully left vakhta',
      vakhta: {
        id: activeVakhta.rows[0].vakhta_id,
        title: activeVakhta.rows[0].title
      }
    });
  } catch (error) {
    console.error('Leave vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ СПЕЦИАЛЬНОСТЕЙ
const getAvailableSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.*,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date,
        s.total_places - (SELECT COUNT(*) FROM borov_specialty_history
                        WHERE specialty_id = s.id AND status = 'active') as free_places,
        EXISTS(
          SELECT 1 FROM borov_specialty_history
          WHERE borov_id = $1 AND specialty_id = s.id AND status = 'active'
        ) as is_joined
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.is_active = true
        AND v.is_active = true
        AND v.start_date > NOW()
        AND s.total_places > (SELECT COUNT(*) FROM borov_specialty_history
                            WHERE specialty_id = s.id AND status = 'active')
      ORDER BY v.start_date ASC, s.title ASC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get available specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ ЗАПИСИ НА СПЕЦИАЛЬНОСТЬ
const joinSpecialty = async (req, res) => {
  try {
    const { specialty_id } = req.body;
    const borov_id = req.user.id;

    const specialtyResult = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.start_date, v.id as vakhta_id,
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

    // Проверяем активные специальности
    const activeSpecialtyResult = await pool.query(
      `SELECT bsh.id, s.title, s.id as specialty_id
       FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE bsh.borov_id = $1 AND bsh.status = 'active'`,
      [borov_id]
    );

    if (activeSpecialtyResult.rows.length > 0) {
      return res.status(400).json({
        error: `You already have an active specialty: ${activeSpecialtyResult.rows[0].title}`,
        active_specialty_id: activeSpecialtyResult.rows[0].specialty_id
      });
    }

    // Записываем на специальность
    await pool.query(
      `INSERT INTO borov_specialty_history (borov_id, specialty_id, start_date, status)
       VALUES ($1, $2, $3, 'active')`,
      [borov_id, specialty_id, specialty.start_date]
    );

    // Обновляем статистику
    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = $1 WHERE borov_id = $2',
      [specialty.vakhta_id, borov_id]
    );

    res.json({
      message: `Successfully joined specialty: ${specialty.title}`,
      specialty: {
        id: specialty.id,
        title: specialty.title,
        vakhta_title: specialty.vakhta_title,
        vakhta_id: specialty.vakhta_id
      }
    });
  } catch (error) {
    console.error('Join specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// НОВЫЙ МЕТОД ДЛЯ ВЫХОДА ИЗ СПЕЦИАЛЬНОСТИ
const leaveSpecialty = async (req, res) => {
  try {
    const borov_id = req.user.id;

    // Находим активную специальность
    const activeSpecialty = await pool.query(
      `SELECT bsh.id, bsh.specialty_id, s.title, s.vakhta_id
       FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE bsh.borov_id = $1 AND bsh.status = 'active'`,
      [borov_id]
    );

    if (activeSpecialty.rows.length === 0) {
      return res.status(400).json({ error: 'No active specialty found' });
    }

    // Обновляем статус на 'completed'
    await pool.query(
      `UPDATE borov_specialty_history
       SET status = 'completed', end_date = NOW()
       WHERE id = $1`,
      [activeSpecialty.rows[0].id]
    );

    // Обновляем статистику
    await pool.query(
      'UPDATE borov_stats SET current_vakhta_id = NULL WHERE borov_id = $1',
      [borov_id]
    );

    res.json({
      message: 'Successfully left specialty',
      specialty: {
        id: activeSpecialty.rows[0].specialty_id,
        title: activeSpecialty.rows[0].title
      }
    });
  } catch (error) {
    console.error('Leave specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ ПОЛУЧЕНИЯ ИСТОРИИ СПЕЦИАЛЬНОСТЕЙ
const getMySpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        bsh.*,
        s.title as specialty_title,
        s.salary,
        v.title as vakhta_title,
        v.location,
        bsh.start_date,
        bsh.end_date,
        bsh.status,
        bsh.created_at as joined_at,
        CASE
          WHEN bsh.status = 'active' THEN true
          ELSE false
        END as is_active
      FROM borov_specialty_history bsh
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE bsh.borov_id = $1
      ORDER BY
        CASE WHEN bsh.status = 'active' THEN 1 ELSE 2 END,
        bsh.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ ПОЛУЧЕНИЯ ИСТОРИИ ВАХТ
const getMyVakhtas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.*,
        bvh.start_date,
        bvh.end_date,
        bvh.status,
        bvh.created_at as joined_at,
        CASE
          WHEN bvh.status = 'active' THEN true
          ELSE false
        END as is_active
      FROM borov_vakhta_history bvh
      JOIN vakhtas v ON bvh.vakhta_id = v.id
      WHERE bvh.borov_id = $1
      ORDER BY
        CASE WHEN bvh.status = 'active' THEN 1 ELSE 2 END,
        bvh.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get my vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// УЛУЧШЕННЫЙ МЕТОД ДЛЯ СТАТИСТИКИ
const getBorovStats = async (req, res) => {
  try {
    const borov_id = req.user.id;

    const result = await pool.query(`
      SELECT
        bs.*,
        v.title as current_vakhta_title,
        s.title as current_specialty_title,
        (SELECT COUNT(*) FROM borov_vakhta_history
         WHERE borov_id = $1 AND status = 'completed') as completed_vakhtas,
        (SELECT COUNT(*) FROM borov_specialty_history
         WHERE borov_id = $1 AND status = 'completed') as completed_specialties
      FROM borov_stats bs
      LEFT JOIN vakhtas v ON bs.current_vakhta_id = v.id
      LEFT JOIN borov_specialty_history bsh ON bsh.borov_id = bs.borov_id AND bsh.status = 'active'
      LEFT JOIN specialties s ON bsh.specialty_id = s.id
      WHERE bs.borov_id = $1
    `, [borov_id]);

    if (result.rows.length === 0) {
      await pool.query(
        'INSERT INTO borov_stats (borov_id) VALUES ($1)',
        [borov_id]
      );

      return res.json({
        total_vakhtas_completed: 0,
        total_work_days: 0,
        current_vakhta_id: null,
        current_vakhta_title: null,
        current_specialty_title: null,
        completed_vakhtas: 0,
        completed_specialties: 0
      });
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

// НОВЫЙ МЕТОД ДЛЯ ПОЛУЧЕНИЯ ТЕКУЩЕЙ АКТИВНОЙ РАБОТЫ
const getCurrentWork = async (req, res) => {
  try {
    const borov_id = req.user.id;

    // Проверяем активную специальность
    const activeSpecialty = await pool.query(`
      SELECT
        bsh.*,
        s.title as specialty_title,
        s.salary,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date
      FROM borov_specialty_history bsh
      JOIN specialties s ON bsh.specialty_id = s.id
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE bsh.borov_id = $1 AND bsh.status = 'active'
      LIMIT 1
    `, [borov_id]);

    // Если есть активная специальность, возвращаем её
    if (activeSpecialty.rows.length > 0) {
      return res.json({
        type: 'specialty',
        work: activeSpecialty.rows[0]
      });
    }

    // Проверяем активную вахту
    const activeVakhta = await pool.query(`
      SELECT
        bvh.*,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date
      FROM borov_vakhta_history bvh
      JOIN vakhtas v ON bvh.vakhta_id = v.id
      WHERE bvh.borov_id = $1 AND bvh.status = 'active'
      LIMIT 1
    `, [borov_id]);

    if (activeVakhta.rows.length > 0) {
      return res.json({
        type: 'vakhta',
        work: activeVakhta.rows[0]
      });
    }

    // Нет активной работы
    res.json({
      type: 'none',
      work: null
    });
  } catch (error) {
    console.error('Get current work error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  getAvailableVakhtas,
  joinVakhta,
  leaveVakhta,
  getMyVakhtas,
  getBorovStats,
  changePassword,
  getAvailableSpecialties,
  joinSpecialty,
  leaveSpecialty,
  getMySpecialties,
  getCurrentWork,
  getPublicProfile,
  updateBorovProfile,
  getBorovProfile
};
