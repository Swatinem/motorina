import { Id } from "./expression";

export interface CustomType<T> {
  encode(value: T): number | string;
  decode(value: any): T;
}

type ColumnType = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | CustomType<any>;

export interface ColumnDefinition {
  [key: string]: ColumnType;
}

export interface Columns {
  [key: string]: Id;
}
