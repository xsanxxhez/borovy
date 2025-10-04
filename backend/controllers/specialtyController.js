// controllers/specialtyController.js
const { pool } = require('../config/database');

// Создание специальности
const createSpecialty = async (req, res) => {
  try {
    const { vakhta_id, title, description, requirements, total_places, salary } = req.body;

    // Валидация
    if (!vakhta_id || !title || !total_places) {
      return res.status(400).json({
        error: 'Missing required fields: vakhta_id, title, total_places'
      });
    }

    // Проверяем существует ли вахта
    const vakhtaCheck = await pool.query(
      'SELECT id FROM vakhtas WHERE id = $1',
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
      `SELECT s.*,
              (SELECT COUNT(*) FROM borov_specialty_history
               WHERE specialty_id = s.id AND status = 'active') as current_workers
       FROM specialties s
       WHERE s.vakhta_id = $1 AND s.is_active = true
       ORDER BY s.created_at DESC`,
      [vakhta_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get specialties error:', error);
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

module.exports = {
  createSpecialty,
  getSpecialtiesByVakhta,
  updateSpecialty
};