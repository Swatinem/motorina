import { Dialect } from "./dialect";
import { Node } from "./node";

export class Builder {
  private sql = "";
  private placeholders: Array<string> = [];

  constructor(public dialect: Dialect) {}

  pushRaw(sql: string) {
    this.sql += sql;
    return this;
  }

  pushIdentifier(id: string) {
    this.pushRaw(this.dialect.identifier(id));
    return this;
  }

  pushLiteral(value: unknown) {
    this.pushRaw(this.dialect.literal(value));
    return this;
  }

  pushPlaceholder(name: string) {
    this.placeholders.push(name);
    this.pushRaw("?");
    return this;
  }

  build(ast: Node) {
    ast.build(this);
    return {
      sql: this.sql,
    };
  }
}
