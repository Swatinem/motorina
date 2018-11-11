import { TableBuilder } from "../";

describe("TableBuilder", () => {
  it("should create a table definition", () => {
    const { table, columns } = new TableBuilder("foo")
      .columns({
        id: Number,
        name: String,
      })
      .build();

    expect(columns).toHaveProperty(["id", "name"]);
    expect(table.select).toBeDefined();
  });
});
