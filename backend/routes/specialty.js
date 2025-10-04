// routes/specialty.js
const express = require('express');
const {
  createSpecialty,
  getSpecialtiesByVakhta,
  updateSpecialty
} = require('../controllers/specialtyController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Только для админов
router.post('/', authenticate, requireRole(['admin']), createSpecialty);
router.put('/:id', authenticate, requireRole(['admin']), updateSpecialty);

// Публичные роуты
router.get('/vakhta/:vakhta_id', getSpecialtiesByVakhta);

module.exports = router;