const { verifyToken } = require('../utils/jwt');
const { pool } = require('../config/database'); // Добавь этот импорт

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Специальная логика для админа
    if (req.user.username === 'admin' && roles.includes('admin')) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Удали или закомментируй эту проблемную функцию requireAdmin
/*
const requireAdmin = (req, res, next) => {
  // Проверяем по роли И по специальному флагу в БД
  if (req.user.role === 'admin') {
    // Дополнительная проверка в БД
    pool.query('SELECT is_admin FROM slons WHERE id = $1', [req.user.id])
      .then(result => {
        if (result.rows.length > 0 && result.rows[0].is_admin) {
          next();
        } else {
          res.status(403).json({ error: 'Admin access required' });
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};
*/

module.exports = {
  authenticate,
  requireRole
  // requireAdmin // Убери этот экспорт
};