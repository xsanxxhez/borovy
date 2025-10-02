const express = require('express');
const { 
  getMyPromoCodes, 
  createPromoCode, 
  getMyBorovs,
  getSlonStats 
} = require('../controllers/slonController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validatePromoCode } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);
router.use(requireRole(['slon']));

// Promo codes
router.get('/promocodes', getMyPromoCodes);
router.post('/promocodes', validatePromoCode, createPromoCode);

// Borovs
router.get('/borovs', getMyBorovs);

// Statistics
router.get('/stats', getSlonStats);

module.exports = router;
