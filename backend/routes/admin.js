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
  getAdminStats,
  getAdminDashboard
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateSlon, validateVakhta } = require('../middleware/validation');

const router = express.Router();

// Используем authenticate для всех роутов
router.use(authenticate);

// Специальная проверка для админа - только пользователь с username 'admin'
const requireAdmin = (req, res, next) => {
  if (req.user.username === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

router.use(requireAdmin);

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

// Dashboard - все данные для админской панели
router.get('/dashboard', getAdminDashboard);

module.exports = router;