import { Connection as MySQL } from "mysql";
import { Client as Postgres } from "pg";

export enum DialectType {
  MySQL = "mysql",
  Postgres = "postgres",
}

interface Escape {
  identifier(id: string): string;
  literal(value: unknown): string;
}

export type Dialect = (
  | {
      type: DialectType.MySQL;
      conn: MySQL;
    }
  | {
      type: DialectType.Postgres;
      conn: Postgres;
    }) &
  Escape;

export function getDialect(conn: MySQL | Postgres): Dialect {
  if ("config" in conn) {
    return {
      type: DialectType.MySQL,
      conn,
      identifier: conn.escapeId.bind(conn),
      literal: conn.escape.bind(conn),
    };
  } else if ("escapeIdentifier" in conn) {
    return {
      type: DialectType.Postgres,
      conn,
      identifier: conn.escapeIdentifier.bind(conn),
      literal: conn.escapeLiteral.bind(conn),
    };
  }
  throw new Error("Unknown Connection");
}
