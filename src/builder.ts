import {
  QueryBuilder as IQueryBuilder,
  Identifier,
  BindParam,
  QueryFragment
} from "./interfaces";

export class QueryBuilder implements IQueryBuilder {
  private sql = "";
  private numParams = 0;
  private paramSlots = new Map<string, Array<number>>();

  public pushRaw(sql: string) {
    this.sql += sql;
  }

  public pushIdentifier(id: Identifier) {
    if (id.table) {
      this.pushRaw(`\`${id.table}\`.`);
    }
    this.pushRaw(`\`${id.name}\``);
  }

  public pushParam(param: BindParam) {
    const slots = this.paramSlots.get(param.name) || [];
    slots.push(this.numParams);
    this.numParams += 1;
    this.paramSlots.set(param.name, slots);

    this.pushRaw(`?`);
  }

  public build(ast: QueryFragment) {
    this.sql = "";
    ast.build(this as any);
    return this.sql;
  }
}
