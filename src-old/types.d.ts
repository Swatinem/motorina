// Table Builder Interface

// Column Types

interface CustomType<T> {
  encode(value: T): number | string;
  decode(value: any): T;
}

type ColumnType = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor /*| CustomType<any>*/; // TODO: custom types

type TypeOfColumn<T extends ColumnType> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
  ? number
  : T extends BooleanConstructor
  ? boolean
  : T extends DateConstructor
  ? Date
  : T extends CustomType<infer U>
  ? U
  : never;

interface ColumnDefinition {
  [key: string]: ColumnType;
}

type MappedColumns<T extends ColumnDefinition> = { [P in keyof T]: TypeOfColumn<T[P]> };
type MapToExpression<Table, T extends { [key: string]: any }> = { [P in keyof T]: Expression<T[P], Table> };
type MapFromExpression<T extends { [key: string]: Expression<any> }> = {
  [P in keyof T]: T[P] extends Expression<infer U> ? U : never
};

// Literal helpers

export function lit<T extends number | string | boolean | Date>(value: T): Expression<T>;
// export declare function lit<T extends ColumnType, U = TypeOfColumn<T>>(value: U, type: T): Expression<T>;

// Table Builder

declare const Table: {};
interface Table<Name = never, Columns = {}> {
  // prettier-ignore
  new <Name extends string>(name: Name): Table<Name>;
  columns<Columns extends ColumnDefinition>(columns: Columns): Table<Name, MappedColumns<Columns>>;
  build(): {
    table: TableDsl<Name>;
    columns: MapToExpression<Name, Columns>;
  };
}

export { Table };

// Query Builder Interface

declare class Expression<Type, Table = any> {
  // because TS lacks nominal typing, we need a property to actually enforce
  // that Expressions with different types or tables are not interchangeable.
  private type: Type;
  private table: Table;

  // NOTE: I don’t think we can make this work with custom types for now
  // eq(value: Type): Expression<boolean, Table>;
  eq<ETable>(expr: Expression<Type, ETable>): Expression<boolean, Table | ETable>;

  and<ETable>(expr: Expression<boolean, ETable>): Expression<boolean, Table | ETable>;

  or<ETable>(expr: Expression<boolean, ETable>): Expression<boolean, Table | ETable>;

  isNull(): Expression<boolean, Table>;
}

// Execute

import { Connection as MySQL } from "mysql";
import { Client as Postgres } from "pg";

type Connection = MySQL | Postgres;

type InspectFn = (args: { sql: string; params: any }) => any;

interface ExecuteOptions {
  inspect?: InspectFn;
}

interface Execute<ReturnValue> {
  // TODO:
  // prepared(): Execute<ReturnValue>;
  execute(conn: Connection, params?: any, options?: ExecuteOptions): Promise<Array<ReturnValue>>;
}

// See above comment about missing nominal typing support in TS
declare const _table: unique symbol;

// Select

interface Select<Tables> {
  [_table]: Tables;
  select<
    CTable extends Tables,
    Expressions extends { [key: string]: Expression<any, Tables> },
    ReturnValue = MapFromExpression<Expressions>
  >(
    selection: Expressions,
  ): Filter<Tables, ReturnValue>;
}

// Filter

type Filter<Tables, ReturnValue> = Execute<ReturnValue> & {
  [_table]: Tables;
  filter<ETable extends Tables>(expr: Expression<boolean, ETable>): Filter<Tables, ReturnValue>;
};

// Table

type TableDsl<Tables> = Select<Tables>;
