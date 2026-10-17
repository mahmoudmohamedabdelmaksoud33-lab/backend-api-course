const AuthService = require("../src/services/auth.service");
const userRepository = require("../src/repositories/user.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../src/repositories/user.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService - Unit Tests", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should hash password and create a new user successfully", async () => {
      const mockUserData = {
        username: "mahmoud",
        email: "mahmoud@test.com",
        password: "123456password",
        role: "user",
      };

      bcrypt.hash.mockResolvedValue("hashed_password_123");
      userRepository.createAndSave.mockResolvedValue({
        id: 1,
        ...mockUserData,
        password: "hashed_password_123",
      });

      const result = await authService.register(mockUserData);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(userRepository.createAndSave).toHaveBeenCalled();
      expect(result).toHaveProperty("username", "mahmoud");
    });
  });

  describe("login", () => {
    it("should throw an error if user does not exist", async () => {
      userRepository.findByUsername.mockResolvedValue(null);

      await expect(
        authService.login({ username: "notfound", password: "123" }),
      ).rejects.toThrow("Invalid username or password");
    });
  });
});
