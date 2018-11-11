import { Table as TableImpl } from "../";
import { Table as ITable } from "../types";

export const Table = (TableImpl as any) as ITable;

import { lit as litImpl } from "../";
import { lit as Ilit } from "../types";

export const lit = (litImpl as any) as typeof Ilit;
