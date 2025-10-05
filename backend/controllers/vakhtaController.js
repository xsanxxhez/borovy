const { pool } = require('../config/database');

// Получение всех активных предприятий со специальностями
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
        ) FILTER (WHERE s.id IS NOT NULL AND s.is_active = true), '[]') as specialties
      FROM vakhtas v
      LEFT JOIN specialties s ON v.id = s.vakhta_id
      WHERE v.is_active = true
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get vakhtas with specialties error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getVakhtasWithSpecialties
};