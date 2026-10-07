const { EntitySchema } = require("typeorm");
const User = require("./user");

module.exports = new EntitySchema({
  name: "note",
  tableName: "notes",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    content: { type: "text" },
  },
  relations: {
    user: {
      target: User,
      type: "many-to-one",
      joinColumn: true,
      nullable: false,
    },
  },
});
