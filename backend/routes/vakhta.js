const express = require('express');
const { getVakhtasWithSpecialties } = require('../controllers/vakhtaController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public route - get active vakhtas with specialties
router.get('/', getVakhtasWithSpecialties);

// Оставь остальные роуты если они нужны
// Get single vakhta
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT *,
             (SELECT COUNT(*) FROM borov_vakhta_history
              WHERE vakhta_id = $1 AND status = 'active') as current_workers
      FROM vakhtas
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vakhta not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get vakhta error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;