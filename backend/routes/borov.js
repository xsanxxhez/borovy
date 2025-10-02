const express = require('express');
const {
  register,
  getAvailableVakhtas,
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

// Statistics
router.get('/stats', getBorovStats);

// Password
router.post('/change-password', changePassword);

module.exports = router;