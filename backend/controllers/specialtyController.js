const { pool } = require('../config/database');

// Создание специальности
const createSpecialty = async (req, res) => {
  try {
    const { vakhta_id, title, description, requirements, total_places, salary } = req.body;

    console.log('Create specialty request:', req.body);

    // Валидация
    if (!vakhta_id || !title || !total_places) {
      return res.status(400).json({
        error: 'Missing required fields: vakhta_id, title, total_places'
      });
    }

    // Проверяем существует ли вахта
    const vakhtaCheck = await pool.query(
      'SELECT id, title FROM vakhtas WHERE id = $1',
      [vakhta_id]
    );

    if (vakhtaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    const result = await pool.query(
      `INSERT INTO specialties (vakhta_id, title, description, requirements, total_places, salary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [vakhta_id, title, description, requirements, total_places, salary || null]
    );

    console.log('Specialty created for vakhta:', vakhtaCheck.rows[0].title);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Получение специальностей по вахте
const getSpecialtiesByVakhta = async (req, res) => {
  try {
    const { vakhta_id } = req.params;

    const result = await pool.query(
      `SELECT s.*, v.title as vakhta_title, v.location,
              (SELECT COUNT(*) FROM borov_specialty_history
               WHERE specialty_id = s.id AND status = 'active') as current_workers,
              s.total_places - (SELECT COUNT(*) FROM borov_specialty_history
                              WHERE specialty_id = s.id AND status = 'active') as free_places
       FROM specialties s
       JOIN vakhtas v ON s.vakhta_id = v.id
       WHERE s.vakhta_id = $1 AND s.is_active = true AND v.is_active = true
       ORDER BY s.created_at DESC`,
      [vakhta_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Получение всех специальностей (для админа)
const getAllSpecialties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, v.title as vakhta_title, v.location, v.is_active as vakhta_active,
             (SELECT COUNT(*) FROM borov_specialty_history
              WHERE specialty_id = s.id AND status = 'active') as current_workers
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get all specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Обновление специальности
const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, total_places, salary, is_active } = req.body;

    const result = await pool.query(
      `UPDATE specialties
       SET title = $1, description = $2, requirements = $3, total_places = $4,
           salary = $5, is_active = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, requirements, total_places, salary, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        s.*,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date,
        v.description as vakhta_description,
        (SELECT COUNT(*) FROM borov_specialty_history
         WHERE specialty_id = s.id AND status = 'active') as current_workers,
        s.total_places - (SELECT COUNT(*) FROM borov_specialty_history
                        WHERE specialty_id = s.id AND status = 'active') as free_places,
        EXISTS(
          SELECT 1 FROM borov_specialty_history
          WHERE borov_id = $2 AND specialty_id = s.id AND status = 'active'
        ) as is_joined
      FROM specialties s
      JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.id = $1 AND s.is_active = true AND v.is_active = true
    `, [id, req.user?.id]); // req.user?.id для проверки, записан ли текущий пользователь

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get specialty by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Удаление специальности
const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем есть ли активные работники на этой специальности
    const activeWorkers = await pool.query(
      'SELECT COUNT(*) FROM borov_specialty_history WHERE specialty_id = $1 AND status = $2',
      [id, 'active']
    );

    if (parseInt(activeWorkers.rows[0].count) > 0) {
      return res.status(400).json({
        error: 'Cannot delete specialty with active workers'
      });
    }

    const result = await pool.query(
      'DELETE FROM specialties WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    res.json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    console.error('Delete specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createSpecialty,
  getSpecialtiesByVakhta,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty,
  getSpecialtyById
};