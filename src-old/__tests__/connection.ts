import { createConnection as MySQLClient } from "mysql";
import { Client as PostgresClient } from "pg";

import { getDialect } from "../dialect";

export const mysql = MySQLClient({});
export const postgres = new PostgresClient();

const connections = [mysql, postgres];
type Connections = typeof mysql | typeof postgres;

export function forDialect(fn: (conn: Connections) => any) {
  for (const conn of connections) {
    const dialect = getDialect(conn);
    describe(`using ${dialect.type}`, () => {
      fn(conn);
    });
  }
}
