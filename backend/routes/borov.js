// routes/borov.js
const express = require('express');
const {
  register,
  getAvailableVakhtas,
  getAvailableSpecialties,
  joinSpecialty,
  getMySpecialties,
  joinVakhta,
  getMyVakhtas,
  getBorovStats,
  changePassword
} = require('../controllers/borovController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateBorov } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateBorov, register);

// Protected routes
router.use(authenticate);
router.use(requireRole(['borov']));

// Vakhtas
router.get('/vakhtas/available', getAvailableVakhtas);
router.post('/vakhtas/join', joinVakhta);
router.get('/vakhtas/my', getMyVakhtas);

// Specialties
router.get('/specialties/available', getAvailableSpecialties);
router.post('/specialties/join', joinSpecialty);
router.get('/specialties/my', getMySpecialties);

// Statistics
router.get('/stats', getBorovStats);

// Password
router.post('/change-password', changePassword);

module.exports = router;