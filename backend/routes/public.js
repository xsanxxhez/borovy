const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Публичный эндпоинт для получения списка специальностей
router.get('/specialties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.*,
        json_agg(
          json_build_object(
            'id', s.id,
            'title', s.title,
            'description', s.description,
            'requirements', s.requirements,
            'salary', s.salary,
            'total_places', s.total_places,
            'current_workers', s.current_workers,
            'free_places', s.total_places - COALESCE(s.current_workers, 0)
          )
        ) as specialties
      FROM vakhtas v
      LEFT JOIN specialties s ON v.id = s.vakhta_id
      WHERE v.status = 'active'
        AND v.start_date > NOW()
        AND v.end_date > NOW()
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching public specialties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// НОВЫЙ ЭНДПОИНТ: Получение конкретной специальности по ID
router.get('/specialties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        s.*,
        v.title as vakhta_title,
        v.location,
        v.start_date,
        v.end_date,
        (s.total_places - COALESCE(s.current_workers, 0)) as free_places
      FROM specialties s
      LEFT JOIN vakhtas v ON s.vakhta_id = v.id
      WHERE s.id = $1
        AND v.start_date > NOW()
        AND v.end_date > NOW()
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching public specialty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;