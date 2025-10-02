const BaseModel = require('./BaseModel');
const { hashPassword, comparePassword } = require('../utils/passwordHash');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByUsername(username) {
    const result = await this.pool.query(
      'SELECT * FROM slons WHERE username = $1 AND is_active = true',
      [username]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      'SELECT * FROM borovs WHERE email = $1',
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
