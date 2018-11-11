import { Id } from "./expression";

export interface CustomType<T> {
  encode(value: T): number | string;
  decode(value: any): T;
}

export type ColumnType = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | CustomType<any>;

export type TypeOfColumn<T extends ColumnType> = T extends StringConstructor
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

export interface Columns {
  [key: string]: Id;
}
