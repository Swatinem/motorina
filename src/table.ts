import { QueryBuilder as IQueryBuilder, QueryFragment } from "./interfaces";
import { Columns } from "./columns";
import { Expression } from "./expression";
import { QueryBuilder } from "./querybuilder";
import { getDialect, Connection } from "./dialect";

interface ResultMapping {
  name: string;
  fragment: QueryFragment;
  // TODO: integrate types
}

export class Table implements QueryFragment {
  public readonly _columns: Array<ResultMapping> = [];
  public readonly _where?: Expression;

  constructor(private name: string) {}

  private clone(props: Partial<Table>): Table {
    const table = new Table(this.name);
    Object.assign(table, this, props);
    return table;
  }

  public select(columns: Columns): Table {
    const _columns = Object.entries(columns).map(([name, fragment]) => ({ name, fragment }));
    return this.clone({ _columns });
  }

  public filter(expr: Expression): Table {
    const _where = this._where ? this._where.and(expr) : expr;
    return this.clone({ _where });
  }

  // TODO
  // public prepared() {}

  public execute(conn: Connection) {
    const dialect = getDialect(conn);
    const builder = new QueryBuilder(dialect);
    return builder.build(this);
  }

  public build(builder: IQueryBuilder) {
    builder.pushRaw("SELECT ");
    let first = true;
    for (const column of this._columns) {
      if (first) {
        first = false;
      } else {
        builder.pushRaw(", ");
      }
      column.fragment.build(builder);
    }
    builder.pushRaw(" FROM ");
    builder.pushIdentifier({ name: this.name });
    if (this._where) {
      builder.pushRaw(" WHERE ");
      this._where.build(builder);
    }
  }
}
