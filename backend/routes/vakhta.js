const express = require('express');
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public route - get active vakhtas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *, 
             (SELECT COUNT(*) FROM borov_vakhta_history 
              WHERE vakhta_id = vakhtas.id AND status = 'active') as current_workers,
             total_places - (SELECT COUNT(*) FROM borov_vakhta_history 
                           WHERE vakhta_id = vakhtas.id AND status = 'active') as free_places
      FROM vakhtas 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get vakhtas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
