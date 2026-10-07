const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await pool.query(
      'INSERT INTO notes (title, content, "userId") VALUES ($1, $2, $3) RETURNING *',
      [title, content, userId],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/notes/search", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "يرجى كتابة كلمة للبحث" });
    }

    const searchQuery = `
      SELECT notes.*, users.name AS author_name 
      FROM notes 
      JOIN users ON notes."userId" = users.id 
      WHERE notes.title ILIKE $1 OR notes.content ILIKE $1;
    `;

    const result = await pool.query(searchQuery, [`%${keyword}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("Task 1 (Raw SQL) server running on port 3000"),
);
