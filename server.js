require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppDataSource = require("./db");
const User = require("./entities/user.js");
const Note = require("./entities/note.js");
const authMiddleware = require("./middleware/auth.middleware.js");

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");

    const userRepository = AppDataSource.getRepository(User);
    const noteRepository = AppDataSource.getRepository(Note);

    // Register
    app.post("/auth/register", async (req, res) => {
      try {
        const { email, password } = req.body;

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ email, password: hashedPassword });
        await userRepository.save(user);

        res.status(201).json({ message: "User registered successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Login
    app.post("/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await userRepository.findOneBy({ email });
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        res.json({ message: "Login successful", token });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Create Note
    app.post("/notes", authMiddleware, async (req, res) => {
      try {
        const { title, content } = req.body;
        const userId = req.user.userId;

        const user = await userRepository.findOneBy({ id: userId });
        const note = noteRepository.create({ title, content, user });
        const result = await noteRepository.save(note);

        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Get Notes
    app.get("/notes/my-notes", authMiddleware, async (req, res) => {
      try {
        const userId = req.user.userId;

        const notes = await noteRepository.find({
          where: { user: { id: userId } },
        });

        res.json(notes);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Update Note
    app.put("/notes/:id", authMiddleware, async (req, res) => {
      try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.userId;

        const note = await noteRepository.findOne({
          where: { id: Number(id), user: { id: userId } },
        });

        if (!note) {
          return res
            .status(404)
            .json({ message: "Note not found or unauthorized" });
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;

        const updatedNote = await noteRepository.save(note);
        res.json(updatedNote);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Delete Note
    app.delete("/notes/:id", authMiddleware, async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user.userId;

        const note = await noteRepository.findOne({
          where: { id: Number(id), user: { id: userId } },
        });

        if (!note) {
          return res
            .status(404)
            .json({ message: "Note not found or unauthorized" });
        }

        await noteRepository.remove(note);
        res.json({ message: "Note deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("DB Connection Error:", error));
