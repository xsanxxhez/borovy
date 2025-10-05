const express = require('express');
const {
  createSpecialty,
  getSpecialtiesByVakhta,
  getAllSpecialties,
  updateSpecialty,
  deleteSpecialty
} = require('../controllers/specialtyController');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Только для админов
router.get('/', authenticate, requireRole(['admin']), getAllSpecialties);
router.post('/', authenticate, requireRole(['admin']), createSpecialty);
router.put('/:id', authenticate, requireRole(['admin']), updateSpecialty);
router.delete('/:id', authenticate, requireRole(['admin']), deleteSpecialty);

// Публичные роуты
router.get('/vakhta/:vakhta_id', getSpecialtiesByVakhta);

module.exports = router;