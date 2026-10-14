const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppDataSource = require("./db");
const User = require("./entities/user");
const Note = require("./entities/note");
const authMiddleware = require("./middleware/auth.middleware");
const adminMiddleware = require("./middleware/admin.middleware");
const { registerSchema, loginSchema } = require("./validators/auth.validator");

const app = express();
app.use(express.json());

// register with Zod Validation
app.post("/auth/register", async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const userRepository = AppDataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = userRepository.create({
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role || "user",
    });

    await userRepository.save(newUser);
    res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    next(error);
  }
});

// login
app.post("/auth/login", async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({
      username: validatedData.username,
    });
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

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    next(error);
  }
});

app.get("/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome to the Admin Dashboard, ${req.user.username}` });
});

// Global Error Handler (Middleware)
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ZodError" || err.issues) {
    statusCode = 400;
    const issues = err.errors || err.issues || [];
    message = issues.map((e) => e.message).join(" | ");
  }

  res.status(statusCode).json({
    status: "fail",
    error: message,
  });
});

// Run
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("Database connection failed:", err));
