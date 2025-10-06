const express = require('express');
const {
  getMyPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getMyBorovs,
  getBorovDetails,
  updateBorovStatus,
  getSlonStats,
  getMySpecialtiesStats,
  getMyBorovActivity,
  getMyVakhtas,
  getCurrentWorkStats,
  exportBorovsData,
  getSlonProfile,
  updateSlonProfile,
  changePassword
} = require('../controllers/slonController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validatePromoCode, validateSlonUpdate } = require('../middleware/validation');

const router = express.Router();

router.use(authenticate);

// Специальная проверка для слонов - слон ИЛИ админ
const requireSlon = (req, res, next) => {
  if (req.user.role === 'slon' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Slon access required' });
  }
};

router.use(requireSlon);

// ==================== ПРОФИЛЬ СЛОНА ====================
router.get('/profile', getSlonProfile);
router.put('/profile', validateSlonUpdate, updateSlonProfile);
router.post('/change-password', changePassword);

// ==================== ПРОМОКОДЫ ====================
router.get('/promocodes', getMyPromoCodes);
router.post('/promocodes', validatePromoCode, createPromoCode);
router.put('/promocodes/:id', validatePromoCode, updatePromoCode);
router.delete('/promocodes/:id', deletePromoCode);

// ==================== БОРОВЫ ====================
router.get('/borovs', getMyBorovs);
router.get('/borovs/:id', getBorovDetails);
router.put('/borovs/:id/status', updateBorovStatus);
router.get('/borovs/export', exportBorovsData);

// ==================== СТАТИСТИКА ====================
router.get('/stats', getSlonStats);
router.get('/stats/current-work', getCurrentWorkStats);
router.get('/stats/specialties', getMySpecialtiesStats);
router.get('/activity/borovs', getMyBorovActivity);

// ==================== ВАХТЫ И СПЕЦИАЛЬНОСТИ ====================
router.get('/vakhtas', getMyVakhtas);

module.exports = router;