const express = require('express');
const {
  getMyPromoCodes,
  createPromoCode,
  getMyBorovs,
  getSlonStats,
  getMySpecialtiesStats,
  getMyBorovActivity
} = require('../controllers/slonController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validatePromoCode } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

// Специальная проверка для слонов - слон ИЛИ админ
const requireSlon = (req, res, next) => {
  if (req.user.role === 'slon' || req.user.username === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Slon access required' });
  }
};

router.use(requireSlon);

// Promo codes
router.get('/promocodes', getMyPromoCodes);
router.post('/promocodes', validatePromoCode, createPromoCode);

// Borovs
router.get('/borovs', getMyBorovs);

// Statistics
router.get('/stats', getSlonStats);
router.get('/activity/borovs', getMyBorovActivity);
router.get('/stats/specialties', getMySpecialtiesStats);

module.exports = router;