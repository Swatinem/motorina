import { QueryBuilder as IQueryBuilder, QueryFragment } from "./interfaces";
import { Columns } from "./columns";
import { Expression } from "./expression";
import { QueryBuilder } from "./querybuilder";

interface ResultMapping {
  name: string;
  fragment: QueryFragment;
  // TODO: integrate types
}

export class Table implements QueryFragment {
  public readonly columns: Array<ResultMapping> = [];
  public readonly where?: Expression;

  constructor(private name: string) {}

  private clone(props: Partial<Table>): Table {
    const table = new Table(this.name);
    Object.assign(table, this, props);
    return table;
  }

  public select(_columns: Columns): Table {
    const columns = Object.entries(_columns).map(([name, fragment]) => ({ name, fragment }));
    return this.clone({ columns });
  }

  public filter(expr: Expression): Table {
    const where = this.where ? this.where.and(expr) : expr;
    return this.clone({ where });
  }

  public prepare(conn: any) {
    const builder = new QueryBuilder(conn);
    return builder.build(this);
  }

  public build(builder: IQueryBuilder) {
    builder.pushRaw("SELECT ");
    let first = true;
    for (const column of this.columns) {
      if (first) {
        first = false;
      } else {
        builder.pushRaw(", ");
      }
      column.fragment.build(builder);
    }
    builder.pushRaw(" FROM ");
    builder.pushIdentifier({ name: this.name });
    if (this.where) {
      builder.pushRaw(" WHERE ");
      this.where.build(builder);
    }
  }
}
