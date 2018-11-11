import { Columns } from "./columns";
import { id } from "./expression";
import { Table } from "./table";
import { ColumnDefinition } from "./columns";

export class TableBuilder {
  private _columns: Columns = {};

  constructor(private name: string) {}

  columns(columns: ColumnDefinition) {
    this._columns = {};
    // TODO: integrate serializable types correctly
    for (const [name /*type*/] of Object.entries(columns)) {
      this._columns[name] = id(name, this.name) as any;
    }
    return this;
  }

  build() {
    return {
      table: new Table(this.name),
      columns: this._columns,
    };
  }
}
