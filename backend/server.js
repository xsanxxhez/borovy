const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Проверяем что переменные загрузились
console.log('=== ENV CHECK ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ LOADED' : '❌ NOT LOADED');
console.log('DB_USER:', process.env.DB_USER || 'NOT FOUND');
console.log('=================');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'borovy',
  user: process.env.DB_USER || 'borovy_user',
  password: process.env.DB_PASSWORD || 'borovy_password',
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

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

// API routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/slon', require('./routes/slon'));
app.use('/api/borov', require('./routes/borov'));
app.use('/api/vakhta', require('./routes/vakhta'));
// Добавьте после других роутов
app.use('/api/specialties', require('./routes/specialty'));


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Borovy backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
