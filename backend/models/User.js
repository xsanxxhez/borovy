const BaseModel = require('./BaseModel');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { pool } = require('../config/database'); // Добавьте этот импорт

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByUsername(username) {
    // Ищем в таблице users, а не slons
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    // Ищем в таблице users, а не borovs
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async createSlon(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const data = {
      ...userData,
      password_hash: hashedPassword
    };
    delete data.password;

    return await this.create(data);
  }

  async createBorov(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const data = {
      ...userData,
      password_hash: hashedPassword
    };
    delete data.password;

    return await this.create(data);
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await comparePassword(plainPassword, hashedPassword);
  }
}

module.exports = new User();