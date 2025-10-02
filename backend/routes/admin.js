const express = require('express');
const { 
  getAllSlons, 
  createSlon, 
  updateSlon,
  getAllPromoCodes,
  getAllBorovs,
  getAllVakhtas,
  createVakhta,
  updateVakhta,
  getAdminStats
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateSlon, validateVakhta } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);
router.use(requireRole(['admin']));

// Slon management
router.get('/slons', getAllSlons);
router.post('/slons', validateSlon, createSlon);
router.put('/slons/:id', validateSlon, updateSlon);

// Promo codes
router.get('/promocodes', getAllPromoCodes);

// Borovs
router.get('/borovs', getAllBorovs);

// Vakhtas
router.get('/vakhtas', getAllVakhtas);
router.post('/vakhtas', validateVakhta, createVakhta);
router.put('/vakhtas/:id', validateVakhta, updateVakhta);

// Statistics
router.get('/stats', getAdminStats);

module.exports = router;
