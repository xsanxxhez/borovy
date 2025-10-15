const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем папку для загрузок, если её нет
//const uploadsDir = path.join(__dirname, '../uploads/avatars');
//if (!fs.existsSync(uploadsDir)) {
//  fs.mkdirSync(uploadsDir, { recursive: true });
//}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Временное решение - используем /tmp папку на Vercel
    cb(null, '/tmp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Проверяем тип файла
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Настройка multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимальный размер
    files: 1 // только один файл
  }
});

// Middleware для обработки ошибок multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only one file allowed.' });
    }
  } else if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

module.exports = {
  upload: upload.single('avatar'),
  handleUploadError
};