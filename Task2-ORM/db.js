const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456789", 
  database: "testdb", 
  synchronize: true,
  logging: false,
  entities: [require("./user"), require("./note")],
});

module.exports = AppDataSource;
