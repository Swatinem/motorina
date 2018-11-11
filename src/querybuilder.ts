import { QueryBuilder as IQueryBuilder, Identifier, BindParam, QueryFragment } from "./interfaces";
import { Dialect, DialectType } from "./dialect";

export class QueryBuilder implements IQueryBuilder {
  private dialect: Dialect;
  private sql = "";
  private numParams = 0;
  private paramSlots = new Map<string, Array<number>>();

  constructor(dialect: Dialect) {
    this.dialect = dialect;
  }

  public pushRaw(sql: string) {
    this.sql += sql;
  }

  public pushIdentifier(id: Identifier) {
    if (id.table) {
      this.pushRaw(this.dialect.identifier(id.table));
      this.pushRaw(".");
    }
    this.pushRaw(this.dialect.identifier(id.name));
  }

  public pushLiteral(value: unknown) {
    this.pushRaw(this.dialect.literal(value));
  }

  public pushParam(param: BindParam) {
    const slots = this.paramSlots.get(param.name) || [];
    slots.push(this.numParams);
    this.numParams += 1;
    this.paramSlots.set(param.name, slots);

    if (this.dialect.type === DialectType.MySQL) {
      this.pushRaw(`?`);
    } else {
      this.pushRaw(`$${this.numParams}`);
    }
  }

  public build(ast: QueryFragment) {
    ast.build(this as any);
    return this.sql;
  }
}
