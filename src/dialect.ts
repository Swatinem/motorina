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

export type Connection = MySQL | Postgres;

const connectionCache = new WeakMap<Connection, Dialect>();

export function getDialect(conn: MySQL | Postgres): Dialect {
  let dialect = connectionCache.get(conn);
  if (dialect) {
    return dialect;
  }

  if ("config" in conn) {
    dialect = {
      type: DialectType.MySQL,
      conn,
      identifier: conn.escapeId.bind(conn),
      literal: conn.escape.bind(conn),
    };
  } else if ("escapeIdentifier" in conn) {
    dialect = {
      type: DialectType.Postgres,
      conn,
      identifier: conn.escapeIdentifier.bind(conn),
      literal(value: unknown) {
        // lolwut? pg only escapes strings, but no other literals?
        if (typeof value === "number") {
          return String(value);
        }
        // Need to figure out something else, how to deal with literal Dates etc…
        return conn.escapeLiteral(String(value));
      },
    };
  } else {
    throw new Error("Unknown Connection Type");
  }

  connectionCache.set(conn, dialect);
  return dialect;
}
