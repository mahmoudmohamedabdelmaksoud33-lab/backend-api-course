const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
  },
  relations: {
    notes: {
      type: "one-to-many",
      target: "Note",
      inverseSide: "user",
    },
  },
});
