import { Expression } from "./expression";
import { QueryBuilder } from "./interfaces";

export class Id extends Expression {
  constructor(private name: string, private table?: string) {
    super();
  }
  public build(builder: QueryBuilder) {
    const { name, table } = this;
    builder.pushIdentifier({ name, table });
  }
}
export function id(name: string, table?: string) {
  return new Id(name, table);
}

export class Param extends Expression {
  constructor(private name: string) {
    super();
  }
  public build(builder: QueryBuilder) {
    builder.pushParam({ name: this.name });
  }
}
export function param(name: string) {
  return new Param(name);
}

export class Lit extends Expression {
  constructor(private value: any) {
    super();
  }
  public build(builder: QueryBuilder) {
    builder.pushRaw(JSON.stringify(this.value));
  }
}
export function lit(value: any) {
  return new Lit(value);
}
