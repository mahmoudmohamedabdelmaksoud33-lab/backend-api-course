const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Note",
  tableName: "notes",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    content: { type: "text" },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: false,
    },
  },
});
