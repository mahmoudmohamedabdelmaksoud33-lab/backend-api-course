const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

class AuthService {
  async register(validatedData) {
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await userRepository.createAndSave({
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role || "user",
    });

    return {
      username: newUser.username,
      role: newUser.role,
    };
  }

  async login(validatedData) {
    const user = await userRepository.findByUsername(validatedData.username);
    if (
      !user ||
      !(await bcrypt.compare(validatedData.password, user.password))
    ) {
      const err = new Error("Invalid username or password");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    return token;
  }
}

module.exports = new AuthService();
