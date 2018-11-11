import { Table as TableImpl } from "../";
import { Table as ITable } from "../types";

export const Table = (TableImpl as any) as ITable;
