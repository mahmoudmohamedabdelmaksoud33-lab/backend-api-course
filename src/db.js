require("dotenv").config();
const { DataSource } = require("typeorm");
const User = require("./entities/user");
const Note = require("./entities/note");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ...(!process.env.DATABASE_URL && {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: false,
  entities: [User, Note],
});

module.exports = AppDataSource;
