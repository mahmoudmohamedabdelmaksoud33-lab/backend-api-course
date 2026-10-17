const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

class AuthController {
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      res.status(201).json({
        message: "User registered successfully",
        user: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const token = await authService.login(validatedData);

      res.json({ message: "Logged in successfully", token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
