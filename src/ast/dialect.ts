import sqlstring from "sqlstring";

export enum DialectType {
  MySQL = "mysql",
  // Postgres = "postgres",
}

interface IDialect {
  type: DialectType;
  identifier(id: string): string;
  literal(value: unknown): string;
}

export class MySQL implements IDialect {
  type = DialectType.MySQL;

  identifier(id: string) {
    return sqlstring.escapeId(id);
  }

  literal(value: unknown) {
    return sqlstring.escape(value);
  }
}

// export class Postgres implements IDialect {
//   type = DialectType.Postgres;
//   // See https://github.com/brianc/node-postgres/blob/2c7be86104e6f4e3ad5f2992b80a54e11a8edff3/lib/client.js#L384-L413
//   identifier(id: string) {
//     return `"${id.replace(/"/g, '""')}"`;
//   }

//   literal(value: unknown) {
//     if (typeof value === "number") {
//       return String(value);
//     }
//     const str = String(value);

//     let hasBackslash = false;
//     let escaped = "'";
//     for (var i = 0; i < str.length; i++) {
//       var c = str[i];
//       if (c === "'") {
//         escaped += c + c;
//       } else if (c === "\\") {
//         escaped += c + c;
//         hasBackslash = true;
//       } else {
//         escaped += c;
//       }
//     }
//     escaped += "'";
//     if (hasBackslash === true) {
//       escaped = "E" + escaped;
//     }

//     return escaped;
//   }
// }

export type Dialect = MySQL;
//  | Postgres;
