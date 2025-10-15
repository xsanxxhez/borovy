const express = require('express');
const {
  register,
  getAvailableVakhtas,
  getAvailableSpecialties,
  joinSpecialty,
  leaveSpecialty,
  getMySpecialties,
  joinVakhta,
  leaveVakhta,
  getMyVakhtas,
  getBorovStats,
  changePassword,
  getCurrentWork,
  getBorovProfile,
  updateBorovProfile,
  getPublicProfile,
  uploadAvatar,
  deleteAvatar,
  getAvatar,
  getMyAvatar
} = require('../controllers/borovController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateBorov } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', validateBorov, register);

// Public avatar route (для получения аватарок других пользователей)
router.get('/avatar/:borov_id', getAvatar);

// Protected routes
router.use(authenticate);
router.use(requireRole(['borov']));

// Current Work
router.get('/current-work', getCurrentWork);

// Vakhtas
router.get('/vakhtas/available', getAvailableVakhtas);
router.post('/vakhtas/join', joinVakhta);
router.post('/vakhtas/leave', leaveVakhta);
router.get('/vakhtas/my', getMyVakhtas);

// Specialties
router.get('/specialties/available', getAvailableSpecialties);
router.post('/specialties/join', joinSpecialty);
router.post('/specialties/leave', leaveSpecialty);
router.get('/specialties/my', getMySpecialties);

// Statistics
router.get('/stats', getBorovStats);

// Profile
router.get('/profile', getBorovProfile);
router.put('/profile', updateBorovProfile);
router.get('/profile/:borov_id/public', getPublicProfile);

// Avatar management
router.post('/avatar', upload, handleUploadError, uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.get('/avatar', getMyAvatar);

// Password
router.post('/change-password', changePassword);

module.exports = router;