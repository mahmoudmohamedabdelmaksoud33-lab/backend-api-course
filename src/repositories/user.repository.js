const AppDataSource = require("../db");
const User = require("../entities/user");

class UserRepository {
  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async findByUsername(username) {
    return await this.repo.findOneBy({ username });
  }

  async createAndSave(userData) {
    const newUser = this.repo.create(userData);
    return await this.repo.save(newUser);
  }
}

module.exports = new UserRepository();
