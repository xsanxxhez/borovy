const bcrypt = require('bcrypt');

// Функция для хеширования пароля
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Функция для проверки пароля
const comparePassword = async (plainPassword, hashedPassword) => {
  if (!hashedPassword) return false;

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = {
  hashPassword,
  comparePassword
};