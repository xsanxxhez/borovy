const BaseModel = require('./BaseModel');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { pool } = require('../config/database');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email) {
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

  // Дополнительный метод для сброса паролей (на время отладки)
  async resetPassword(username, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE username = $2 RETURNING *',
      [hashedPassword, username]
    );
    return result.rows[0];
  }
}

module.exports = new User();