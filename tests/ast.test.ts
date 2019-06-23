import { Builder, Dot, Eq, Identifier, Literal, MySQL, Or, Select, Call, Raw, Placeholder } from "../src/ast";

describe("AST", () => {
  it("should build a simple AST", () => {
    const ast = new Select([new Literal(1)]);

    let builder = new Builder(new MySQL());
    expect(builder.build(ast).sql).toEqual("SELECT 1");
  });

  it("should build a more complex select", () => {
    const ast = new Select(
      [new Dot(new Identifier("t"), new Identifier("id"))],
      new Identifier("t"),
      new Or(new Eq(new Identifier("id"), new Literal(1)), new Eq(new Identifier("id"), new Literal(2))),
    );

    let builder = new Builder(new MySQL());
    expect(builder.build(ast).sql).toEqual("SELECT `t`.`id` FROM `t` WHERE `id` = 1 OR `id` = 2");
  });

  it("should build a query with functions and placeholders", () => {
    const ast = new Select(
      [new Call(new Raw("COUNT"), [new Raw("*")])],
      new Identifier("t"),
      new Eq(new Identifier("id"), new Placeholder("id")),
    );

    let builder = new Builder(new MySQL());
    expect(builder.build(ast).sql).toEqual("SELECT COUNT(*) FROM `t` WHERE `id` = ?");
  });
});
