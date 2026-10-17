const express = require("express");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const adminMiddleware = require("./middleware/admin.middleware");

const app = express();
app.use(express.json());

// Auth Routes
app.use("/auth", authRoutes);

// Admin Dashboard Route
app.get("/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome to the Admin Dashboard, ${req.user.username}` });
});

// Global Error Handler
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

module.exports = app;
