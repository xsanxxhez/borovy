const path = require('path');

// Загружаем .env файлы ТОЛЬКО в разработке
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Импортируем обновлённую конфигурацию БД
const { pool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy для продакшена
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Детальная проверка переменных окружения
console.log('=== 🚀 ENVIRONMENT CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('PORT:', PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ LOADED' : '❌ NOT LOADED');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ LOADED' : '❌ NOT LOADED');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ LOADED' : '❌ NOT LOADED');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('================================');

// ОБНОВЛЕННЫЙ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Разрешаем запросы без origin (например, из мобильных приложений, серверные запросы)
    if (!origin) return callback(null, true);

    // Список разрешенных доменов
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://borovy-frontend.vercel.app',
      'https://borovy.onrender.com',
      'https://borovy-backend.onrender.com'
    ];

    // Разрешаем все поддомены vercel.app и onrender.com
    const allowedPatterns = [
      /\.vercel\.app$/,
      /\.onrender\.com$/
    ];

    // Проверяем точное совпадение или паттерн
    const isAllowed = allowedOrigins.includes(origin) ||
                     allowedPatterns.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Явная обработка OPTIONS запросов для всех маршрутов
app.options('*', cors());

// Остальные middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ТЕСТОВЫЙ РОУТ ДЛЯ ПРОВЕРКИ
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Borovy Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.DATABASE_URL ? '✅ Connected' : '❌ Not connected',
    version: '1.0.0'
  });
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Public routes
const publicRoutes = require('./routes/public');
app.use('/api/public', publicRoutes);

// API routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/slon', require('./routes/slon'));
app.use('/api/borov', require('./routes/borov'));
app.use('/api/vakhta', require('./routes/vakhta'));
app.use('/api/specialties', require('./routes/specialty'));

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy: Origin not allowed'
    });
  }

  res.status(500).json({
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

app.listen(PORT, () => {
  console.log(`✅ Borovy backend server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;