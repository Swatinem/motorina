// declare class Column<Table, Name, Type> {
//   private table: Table;
//   private name: Name;
//   private type: Type;

//   as<Name extends string>(name: Name): Column<Table, Name, Type>;

//   eq(value: Type): Column<Table, undefined, boolean>;
//   eq<CTable>(
//     value: Column<CTable, any, Type>
//   ): Column<Table | CTable, undefined, boolean>;
// }

// declare function lit<T>(value: T): Column<any, undefined, T>;

// declare const _table: unique symbol;

// type Select<Tables, JoinTables, ReturnValue = undefined> = {
//   [_table]: Tables;
//   select<
//     CTable extends Tables,
//     CName1 extends string & ReturnValue extends undefined
//       ? string
//       : keyof ReturnValue extends CName1
//       ? never
//       : string,
//     CType1,
//     NewReturnValue = (ReturnValue extends {} ? ReturnValue : {}) &
//       { [key in CName1]: CType1 }
//   >(
//     expr1: Column<CTable, CName1, CType1>
//   ): Select<Tables, JoinTables, NewReturnValue> &
//     Where<Tables, JoinTables, NewReturnValue>;
// };

// type Where<Tables, JoinTables, ReturnValue> = Run<ReturnValue> & {
//   [_table]: Tables;
//   where<CTable extends Tables, CType1 extends boolean>(
//     expr1: Column<CTable, any, CType1>
//   ): Where<Tables, JoinTables, ReturnValue>;
// };

// type Join<Tables, JoinTables> = {
//   [_table]: Tables;
//   join<TableName extends JoinTables>(
//     t: Table<TableName, any>
//   ): Table<Tables | TableName, JoinTables>;
// };

// type Run<ReturnValue> = {
//   run(): Promise<Array<ReturnValue>>;
// };

// type Table<Tables, JoinTables = Tables> = Select<Tables, JoinTables> &
//   Join<Tables, JoinTables>;

// // declare class Table<Tables, JoinTables = Tables, ReturnValue = undefined> {
// //   private tables: Tables;
// //   //   private returns: ReturnValue;

// //   select<
// //     CTable extends Tables,
// //     CName1 extends string & ReturnValue extends undefined
// //       ? string
// //       : keyof ReturnValue extends CName1
// //       ? never
// //       : string,
// //     CType1
// //   >(
// //     expr1: Column<CTable, CName1, CType1>
// //   ): Table<
// //     Tables,
// //     JoinTables,
// //     (ReturnValue extends {} ? ReturnValue : {}) & { [key in CName1]: CType1 }
// //   >;

// //   where<CTable extends Tables, CType1 extends boolean>(
// //     expr1: Column<CTable, any, CType1>
// //   ): Table<Tables, JoinTables, ReturnValue>;

// //   join: ReturnValue extends {}
// //     ? undefined
// //     : <TableName extends JoinTables>(
// //         t: Table<TableName>
// //       ) => Table<Tables | TableName, JoinTables>;

// //   run: ReturnValue extends {} ? () => Promise<ReturnValue> : undefined;
// // }

// declare const t1: Table<"t1", "t1" | "t2">;
// declare const t2: Table<"t2", "t1" | "t2">;
// declare const t3: Table<"t3">;
// declare const t1id: Column<"t1", "id", number>;
// declare const t2id: Column<"t2", "id", number>;
// const lnum = lit(0);
// const lstr = lit("");

// // can’t run without a select
// t1.run();
// t1.select(t1id).run();

// // can’t select a literal without an alias
// t1.select(lnum);
// t1.select(lnum.as("foo")).run();

// // can’t reuse the same alias
// t1.select(lnum.as("id1"))
//   .select(lnum.as("id2"))
//   .run();
// t1.select(lnum.as("id")).select(lnum.as("id"));

// // can’t select foreign columns without a join
// t1.select(t2id);
// t1.select(t1id);

// // can select foreign columns of joined tables only
// t1.join(t2)
//   .select(t1id)
//   .select(t2id.as("t2"))
//   .run();
// t3.join(t2);

// // can’t join after selection
// t1.select(t1id).join(t2);

// // can only run where with boolean expressions
// t1.select(t1id).where(t1id);
// t1.select(t1id).where(t1id.eq(1));
// t1.select(t1id).where(t1id.eq(t1id));

// // expressions take into account join tables
// t1.select(t1id).where(t1id.eq(t2id));
// t1.join(t2)
//   .select(t1id)
//   .where(t1id.eq(t2id));

// // can use expressions inside select
// t1.select(t1id.eq(1).as("foo")).run();
