const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

//  GET - Fetch all users
app.get("/users", (req, res) => {
  const fileData = fs.readFileSync("./data.json", "utf-8");
  const users = JSON.parse(fileData);

  res.json(users);
});

//  POST - Add a new user
app.post("/users", (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Invalid input: Name is required and must be a non-empty string.",
    });
  }

  const fileData = fs.readFileSync("./data.json", "utf-8");
  const users = JSON.parse(fileData);

  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);

  fs.writeFileSync("./data.json", JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User added successfully!", user: newUser });
});

// PUT - Update user by ID
app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const { name } = req.body;

  const fileData = fs.readFileSync("./data.json", "utf-8");
  let users = JSON.parse(fileData);

  // Check if user exists
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  // Validate the name
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Invalid input: Name is required and must be a non-empty string.",
    });
  }

  // Update user
  users[userIndex] = { ...users[userIndex], ...req.body, id: userId };

  fs.writeFileSync("./data.json", JSON.stringify(users, null, 2));

  res.json({
    message: "User updated successfully!",
    user: users[userIndex],
  });
});

//  DELETE - Delete user by ID
app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const fileData = fs.readFileSync("./data.json", "utf-8");
  const users = JSON.parse(fileData);

  // Check if user exists
  const userExists = users.some((user) => user.id === userId);
  if (!userExists) {
    return res.status(404).json({ error: "User not found." });
  }

  // Filter out the user
  const updatedUsers = users.filter((user) => user.id !== userId);

  fs.writeFileSync("./data.json", JSON.stringify(updatedUsers, null, 2));

  res.json({ message: "User deleted successfully!" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
