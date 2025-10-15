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

const getVakhtasWithSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.*,
        -- Используем current_workers из таблицы vakhtas вместо подсчета
        COALESCE(v.current_workers, 0) as current_workers,
        v.total_places - COALESCE(v.current_workers, 0) as free_places,
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

// В adminController.js добавить методы для управления боровыми

// Снять борова со всех активных работ
const removeBorovFromAllWork = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { borov_id } = req.params;

    console.log('🔄 Removing borov from all work:', borov_id);

    // 1. Проверяем существование борова
    const borovCheck = await client.query(
      'SELECT id, full_name FROM borovs WHERE id = $1',
      [borov_id]
    );

    if (borovCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Borov not found' });
    }

    const borov = borovCheck.rows[0];

    // 2. Снимаем с активных вахт
    const activeVakhtas = await client.query(
      'SELECT vakhta_id FROM borov_vakhta_history WHERE borov_id = $1 AND status = $2',
      [borov_id, 'active']
    );

    for (const vakhta of activeVakhtas.rows) {
      await client.query(
        `UPDATE borov_vakhta_history
         SET status = 'completed', end_date = NOW()
         WHERE borov_id = $1 AND vakhta_id = $2 AND status = 'active'`,
        [borov_id, vakhta.vakhta_id]
      );

      // Обновляем счетчик на вахте
      await client.query(
        `UPDATE vakhtas
         SET current_workers = GREATEST(COALESCE(current_workers, 0) - 1, 0)
         WHERE id = $1`,
        [vakhta.vakhta_id]
      );
    }

    // 3. Снимаем с активных специальностей
    const activeSpecialties = await client.query(
      `SELECT s.vakhta_id FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE bsh.borov_id = $1 AND bsh.status = $2`,
      [borov_id, 'active']
    );

    for (const specialty of activeSpecialties.rows) {
      await client.query(
        `UPDATE borov_specialty_history
         SET status = 'completed', end_date = NOW()
         WHERE borov_id = $1 AND status = 'active'`,
        [borov_id]
      );

      // Обновляем счетчик на вахте
      await client.query(
        `UPDATE vakhtas
         SET current_workers = GREATEST(COALESCE(current_workers, 0) - 1, 0)
         WHERE id = $1`,
        [specialty.vakhta_id]
      );
    }

    // 4. Обновляем статистику
    await client.query(
      'UPDATE borov_stats SET current_vakhta_id = NULL WHERE borov_id = $1',
      [borov_id]
    );

    await client.query('COMMIT');

    const totalRemoved = activeVakhtas.rows.length + activeSpecialties.rows.length;
    console.log('✅ Removed borov from', totalRemoved, 'work assignments');

    res.json({
      message: `Borov "${borov.full_name}" removed from ${totalRemoved} work assignments`,
      removed_count: totalRemoved
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Remove borov from work error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    client.release();
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



// В adminController.js и slonController.js нет deletePromoCode
// Нужно добавить:
const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем привязанных боровов
    const borovsCheck = await pool.query(
      'SELECT COUNT(*) FROM borovs WHERE promo_code_id = $1',
      [id]
    );

    if (parseInt(borovsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete promo code with registered borovs'
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

const deleteSlon = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем есть ли промокоды у слона
    const promoCodesCheck = await pool.query(
      'SELECT COUNT(*) FROM promo_codes WHERE slon_id = $1',
      [id]
    );

    if (parseInt(promoCodesCheck.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete slon with active promo codes'
      });
    }

    const result = await pool.query(
      'DELETE FROM slons WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slon not found' });
    }

    res.json({ message: 'Slon deleted successfully' });
  } catch (error) {
    console.error('Delete slon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// В adminController.js заменим существующие методы:

const deleteVakhta = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { id } = req.params;

    console.log('🔄 Starting delete vakhta process for ID:', id);

    // 1. Проверяем активных работников на самой вахте (используем current_workers из таблицы)
    const vakhtaInfo = await client.query(
      'SELECT current_workers, title FROM vakhtas WHERE id = $1',
      [id]
    );

    if (vakhtaInfo.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    const currentWorkers = vakhtaInfo.rows[0].current_workers || 0;

    if (currentWorkers > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Cannot delete vakhta with ${currentWorkers} active workers. Please remove workers first.`
      });
    }

    // 2. Проверяем активных работников на специальностях этой вахты
    const activeSpecialtyWorkers = await client.query(
      `SELECT COUNT(*) FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE s.vakhta_id = $1 AND bsh.status = 'active'`,
      [id]
    );

    if (parseInt(activeSpecialtyWorkers.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Cannot delete vakhta with active workers on its specialties'
      });
    }

    console.log('✅ No active workers found, proceeding with deletion...');

    // 3. Удаляем историю специальностей
    await client.query(
      `DELETE FROM borov_specialty_history
       WHERE specialty_id IN (SELECT id FROM specialties WHERE vakhta_id = $1)`,
      [id]
    );

    // 4. Удаляем специальности
    await client.query(
      'DELETE FROM specialties WHERE vakhta_id = $1',
      [id]
    );

    // 5. Удаляем историю вахт (на всякий случай, хотя current_workers уже 0)
    await client.query(
      'DELETE FROM borov_vakhta_history WHERE vakhta_id = $1',
      [id]
    );

    // 6. Обновляем статистику боровов (на всякий случай)
    await client.query(
      'UPDATE borov_stats SET current_vakhta_id = NULL WHERE current_vakhta_id = $1',
      [id]
    );

    // 7. Удаляем вахту
    const result = await client.query(
      'DELETE FROM vakhtas WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');
    console.log('✅ Vakhta deleted successfully:', id);
    res.json({ message: 'Vakhta deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Delete vakhta error:', error);

    // Более информативное сообщение об ошибке
    let errorMessage = 'Internal server error';
    if (error.code === '23503') {
      errorMessage = 'Cannot delete vakhta - there are still related records in the database';
    }

    res.status(500).json({ error: errorMessage + ': ' + error.message });
  } finally {
    client.release();
  }
};

// В adminController.js добавить отладочный метод
const debugVakhtaWorkers = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🔍 Debug vakhta workers for ID:', id);

    // 1. Информация о вахте
    const vakhtaInfo = await pool.query(
      'SELECT id, title, current_workers, total_places FROM vakhtas WHERE id = $1',
      [id]
    );

    // 2. Работники на самой вахте
    const vakhtaWorkers = await pool.query(
      'SELECT COUNT(*) as count FROM borov_vakhta_history WHERE vakhta_id = $1 AND status = $2',
      [id, 'active']
    );

    // 3. Работники на специальностях
    const specialtyWorkers = await pool.query(
      `SELECT COUNT(*) as count FROM borov_specialty_history bsh
       JOIN specialties s ON bsh.specialty_id = s.id
       WHERE s.vakhta_id = $1 AND bsh.status = $2`,
      [id, 'active']
    );

    // 4. Специальности этой вахты
    const specialties = await pool.query(
      'SELECT id, title FROM specialties WHERE vakhta_id = $1',
      [id]
    );

    const debugInfo = {
      vakhta: vakhtaInfo.rows[0] || null,
      vakhta_workers: parseInt(vakhtaWorkers.rows[0].count),
      specialty_workers: parseInt(specialtyWorkers.rows[0].count),
      specialties: specialties.rows,
      total_workers: parseInt(vakhtaWorkers.rows[0].count) + parseInt(specialtyWorkers.rows[0].count)
    };

    console.log('🔍 Debug info:', debugInfo);
    res.json(debugInfo);

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Debug error: ' + error.message });
  }
};
// Добавить в adminController.js

// В adminController.js - проверьте этот метод
const getVakhtaWorkers = async (req, res) => {
  try {
    const { vakhta_id } = req.params;

    console.log('🔄 Getting workers for vakhta:', vakhta_id);

    const result = await pool.query(`
      SELECT
        bvh.*,
        b.full_name,
        b.phone,
        b.email,
        b.id as borov_id,
        v.title as vakhta_title
      FROM borov_vakhta_history bvh
      JOIN borovs b ON bvh.borov_id = b.id
      JOIN vakhtas v ON bvh.vakhta_id = v.id
      WHERE bvh.vakhta_id = $1 AND bvh.status = 'active'
      ORDER BY bvh.created_at DESC
    `, [vakhta_id]);

    console.log('✅ Found workers:', result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Get vakhta workers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// В adminController.js обновим метод removeAllWorkersFromVakhta
const removeAllWorkersFromVakhta = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { vakhta_id } = req.params;

    console.log('🔄 Removing all workers from vakhta:', vakhta_id);

    // 1. Получаем информацию о работниках
    const activeWorkers = await client.query(`
      SELECT borov_id FROM borov_vakhta_history
      WHERE vakhta_id = $1 AND status = 'active'
    `, [vakhta_id]);

    // 2. Получаем информацию о работниках на специальностях этой вахты
    const activeSpecialtyWorkers = await client.query(`
      SELECT borov_id FROM borov_specialty_history bsh
      JOIN specialties s ON bsh.specialty_id = s.id
      WHERE s.vakhta_id = $1 AND bsh.status = 'active'
    `, [vakhta_id]);

    const totalWorkers = activeWorkers.rows.length + activeSpecialtyWorkers.rows.length;

    if (totalWorkers === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'No active workers found on this vakhta'
      });
    }

    // 3. Обновляем статус работников на вахте
    await client.query(`
      UPDATE borov_vakhta_history
      SET status = 'completed', end_date = NOW()
      WHERE vakhta_id = $1 AND status = 'active'
    `, [vakhta_id]);

    // 4. Обновляем статус работников на специальностях
    await client.query(`
      UPDATE borov_specialty_history
      SET status = 'completed', end_date = NOW()
      WHERE specialty_id IN (SELECT id FROM specialties WHERE vakhta_id = $1)
      AND status = 'active'
    `, [vakhta_id]);

    // 5. Обновляем статистику боровов
    const allBorovIds = [
      ...activeWorkers.rows.map(row => row.borov_id),
      ...activeSpecialtyWorkers.rows.map(row => row.borov_id)
    ];

    for (const borovId of allBorovIds) {
      await client.query(`
        UPDATE borov_stats
        SET current_vakhta_id = NULL
        WHERE borov_id = $1 AND current_vakhta_id = $2
      `, [borovId, vakhta_id]);
    }

    // 6. СБРАСЫВАЕМ СЧЕТЧИК РАБОТНИКОВ НА ВАХТЕ
    await client.query(`
      UPDATE vakhtas
      SET current_workers = 0
      WHERE id = $1
    `, [vakhta_id]);

    await client.query('COMMIT');

    console.log('✅ Removed', totalWorkers, 'workers from vakhta:', vakhta_id);
    res.json({
      message: `Successfully removed ${totalWorkers} workers from vakhta`,
      removed_count: totalWorkers
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Remove all workers from vakhta error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    client.release();
  }
};

// Снять конкретного работника с вахты
const removeWorkerFromVakhta = async (req, res) => {
  try {
    const { vakhta_id, borov_id } = req.params;

    console.log('🔄 Removing worker from vakhta:', { vakhta_id, borov_id });

    // Проверяем существует ли такая запись
    const workerRecord = await pool.query(`
      SELECT * FROM borov_vakhta_history
      WHERE vakhta_id = $1 AND borov_id = $2 AND status = 'active'
    `, [vakhta_id, borov_id]);

    if (workerRecord.rows.length === 0) {
      return res.status(404).json({
        error: 'Worker not found or not active on this vakhta'
      });
    }

    // Обновляем статус работника
    await pool.query(`
      UPDATE borov_vakhta_history
      SET status = 'completed', end_date = NOW()
      WHERE vakhta_id = $1 AND borov_id = $2 AND status = 'active'
    `, [vakhta_id, borov_id]);

    // Обновляем статистику борова
    await pool.query(`
      UPDATE borov_stats
      SET current_vakhta_id = NULL
      WHERE borov_id = $1 AND current_vakhta_id = $2
    `, [borov_id, vakhta_id]);

    console.log('✅ Removed worker from vakhta');
    res.json({
      message: 'Worker successfully removed from vakhta',
      borov_name: workerRecord.rows[0].full_name
    });

  } catch (error) {
    console.error('Remove worker from vakhta error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

const deleteSpecialty = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { id } = req.params;

    console.log('🔄 Starting delete specialty process for ID:', id);

    // 1. Проверяем активных работников
    const activeWorkers = await client.query(
      'SELECT COUNT(*) FROM borov_specialty_history WHERE specialty_id = $1 AND status = $2',
      [id, 'active']
    );

    if (parseInt(activeWorkers.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Cannot delete specialty with active workers'
      });
    }

    // 2. Удаляем историю
    await client.query(
      'DELETE FROM borov_specialty_history WHERE specialty_id = $1',
      [id]
    );

    // 3. Удаляем специальность
    const result = await client.query(
      'DELETE FROM specialties WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Specialty not found' });
    }

    await client.query('COMMIT');
    console.log('✅ Specialty deleted successfully:', id);
    res.json({ message: 'Specialty deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Delete specialty error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    client.release();
  }
};
// Добавить в adminController.js

// Добавить в adminController.js

// Упрощенная версия для тестирования
const getBorovProfileSimple = async (req, res) => {
  try {
    const { borov_id } = req.params;
    console.log('🔄 ADMIN: Fetching borov profile for ID:', borov_id);
    console.log('🔄 ADMIN: Request params:', req.params);
    console.log('🔄 ADMIN: Request user:', req.user);

    // Базовая информация о борове
    const borovResult = await pool.query(`
      SELECT
        b.id, b.full_name, b.email, b.phone, b.birth_date, b.created_at,
        pc.code as promo_code,
        s.display_name as slon_name
      FROM borovs b
      LEFT JOIN promo_codes pc ON b.promo_code_id = pc.id
      LEFT JOIN slons s ON pc.slon_id = s.id
      WHERE b.id = $1
    `, [borov_id]);

    console.log('🔄 ADMIN: Borov query result:', borovResult.rows);

    if (borovResult.rows.length === 0) {
      console.log('❌ ADMIN: Borov not found for ID:', borov_id);
      return res.status(404).json({ error: 'Borov not found' });
    }

    const borov = borovResult.rows[0];

    // Статистика
    const statsResult = await pool.query(`
      SELECT total_vakhtas_completed, total_work_days, current_vakhta_id
      FROM borov_stats
      WHERE borov_id = $1
    `, [borov_id]);

    console.log('🔄 ADMIN: Stats result:', statsResult.rows);

    // Анкета
    const profileResult = await pool.query(`
      SELECT * FROM borov_profiles WHERE borov_id = $1
    `, [borov_id]);

    console.log('🔄 ADMIN: Profile result:', profileResult.rows);

    const response = {
      ...borov,
      stats: statsResult.rows[0] || { total_vakhtas_completed: 0, total_work_days: 0 },
      profile: profileResult.rows[0] || null
    };

    console.log('✅ ADMIN: Sending response for borov:', borov.full_name);
    res.json(response);
  } catch (error) {
    console.error('❌ ADMIN: Get simple borov profile error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// В adminController.js добавить метод удаления борова
const deleteBorov = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { id } = req.params;

    console.log('🔄 Starting delete borov process for ID:', id);

    // 1. Проверяем существование борова
    const borovCheck = await client.query(
      'SELECT id, full_name FROM borovs WHERE id = $1',
      [id]
    );

    if (borovCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Borov not found' });
    }

    const borov = borovCheck.rows[0];

    // 2. Проверяем активные вахты
    const activeVakhta = await client.query(
      'SELECT COUNT(*) FROM borov_vakhta_history WHERE borov_id = $1 AND status = $2',
      [id, 'active']
    );

    // 3. Проверяем активные специальности
    const activeSpecialty = await client.query(
      'SELECT COUNT(*) FROM borov_specialty_history WHERE borov_id = $1 AND status = $2',
      [id, 'active']
    );

    if (parseInt(activeVakhta.rows[0].count) > 0 || parseInt(activeSpecialty.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Cannot delete borov with active work assignments. Please remove from vakhtas/specialties first.'
      });
    }

    console.log('✅ No active assignments found, proceeding with deletion...');

    // 4. Удаляем историю специальностей
    await client.query(
      'DELETE FROM borov_specialty_history WHERE borov_id = $1',
      [id]
    );

    // 5. Удаляем историю вахт
    await client.query(
      'DELETE FROM borov_vakhta_history WHERE borov_id = $1',
      [id]
    );

    // 6. Удаляем анкету
    await client.query(
      'DELETE FROM borov_profiles WHERE borov_id = $1',
      [id]
    );

    // 7. Удаляем статистику
    await client.query(
      'DELETE FROM borov_stats WHERE borov_id = $1',
      [id]
    );

    // 8. Удаляем самого борова
    const result = await client.query(
      'DELETE FROM borovs WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');

    console.log('✅ Borov deleted successfully:', borov.full_name);
    res.json({
      message: `Borov "${borov.full_name}" deleted successfully`,
      deleted_borov: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Delete borov error:', error);

    let errorMessage = 'Internal server error';
    if (error.code === '23503') {
      errorMessage = 'Cannot delete borov - there are still related records in the database';
    }

    res.status(500).json({ error: errorMessage + ': ' + error.message });
  } finally {
    client.release();
  }
};

const forceDeleteVakhta = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { id } = req.params;

    console.log('🔄 FORCE DELETE vakhta:', id);

    // 1. Удаляем историю специальностей
    await client.query(
      `DELETE FROM borov_specialty_history
       WHERE specialty_id IN (SELECT id FROM specialties WHERE vakhta_id = $1)`,
      [id]
    );

    // 2. Удаляем специальности
    await client.query(
      'DELETE FROM specialties WHERE vakhta_id = $1',
      [id]
    );

    // 3. Удаляем историю вахт
    await client.query(
      'DELETE FROM borov_vakhta_history WHERE vakhta_id = $1',
      [id]
    );

    // 4. Обновляем статистику боровов
    await client.query(
      'UPDATE borov_stats SET current_vakhta_id = NULL WHERE current_vakhta_id = $1',
      [id]
    );

    // 5. Удаляем вахту
    const result = await client.query(
      'DELETE FROM vakhtas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    await client.query('COMMIT');
    console.log('✅ Vakhta force deleted successfully:', id);
    res.json({ message: 'Vakhta force deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Force delete vakhta error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    client.release();
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
  createSpecialty,
  deleteSpecialty,
  deletePromoCode,
  deleteSlon,
  deleteVakhta,
  getBorovProfileSimple,
  getVakhtaWorkers,
      removeAllWorkersFromVakhta,
      removeWorkerFromVakhta,
      debugVakhtaWorkers,
      deleteBorov,
      removeBorovFromAllWork,
      forceDeleteVakhta
};