const express = require('express');
const {
  getAllSlons,
  createSlon,
  updateSlon,
  getAllPromoCodes,
  createPromoCode,
  getAllBorovs,
  getAllVakhtas,
  createVakhta,
  updateVakhta,
  getAdminStats,
  getAdminDashboard,
  getAllSpecialties,
  getBorovActivity,
  getVakhtasWithSpecialties,
  createSpecialty
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateSlon, validateVakhta } = require('../middleware/validation');

const router = express.Router();

// Используем authenticate для всех роутов
router.use(authenticate);

// Специальная проверка для админа - только пользователь с username 'admin'
const requireAdmin = (req, res, next) => {
  console.log('Admin check - user:', req.user); // Добавим лог

  if (req.user.role === 'admin' || req.user.username === 'admin') {
    next();
  } else {
    console.log('Admin access denied for user:', req.user.username);
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
router.post('/promocodes', createPromoCode);

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
router.get('/specialties', getAllSpecialties);
router.post('/specialties', createSpecialty);

// Activity logs
router.get('/activity/borovs', getBorovActivity);
// Добавь этот роут после существующих vakhtas роутов:

// Vakhtas with specialties
router.get('/vakhtas-with-specialties', getVakhtasWithSpecialties);




module.exports = router;