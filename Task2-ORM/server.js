const express = require("express");
const AppDataSource = require("./db");
const User = require("./user");
const Note = require("./note");
const { ILike } = require("typeorm");

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Task 2 (TypeORM) Database connected!");

    const userRepository = AppDataSource.getRepository(User);
    const noteRepository = AppDataSource.getRepository(Note);

    // POST /users
    app.post("/users", async (req, res) => {
      try {
        const user = userRepository.create(req.body);
        const result = await userRepository.save(user);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /notes
    app.post("/notes", async (req, res) => {
      try {
        const { title, content, userId } = req.body;
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const note = noteRepository.create({ title, content, user });
        const result = await noteRepository.save(note);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /notes/search
    app.get("/notes/search", async (req, res) => {
      try {
        const { keyword } = req.query;
        if (!keyword) {
          return res.status(400).json({ message: "يرجى كتابة كلمة للبحث" });
        }
        const notes = await noteRepository.find({
          where: [
            { title: ILike(`%${keyword}%`) },
            { content: ILike(`%${keyword}%`) },
          ],
          relations: {
            user: true, // Object syntax الحديثة
          },
        });
        res.json(notes);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(3000, () => {
      console.log("Task 2 (TypeORM) server running on port 3000");
    });
  })
  .catch((error) => console.log("DB Connection Error:", error));
