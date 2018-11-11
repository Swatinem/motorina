import { forDialect } from "./connection";
import { test1 } from "./testtable";
import { lit } from "./";

forDialect(conn => {
  it("should build a simple query", () => {
    test1.table.select(test1.columns).execute(
      conn,
      {},
      {
        inspect({ sql }) {
          expect(sql).toMatchSnapshot();
        },
      },
    );
  });
  it("should correctly escape literals", () => {
    test1.table
      .select(test1.columns)
      .filter(test1.columns.id.eq(lit(123)))
      .execute(
        conn,
        {},
        {
          inspect({ sql }) {
            expect(sql).toMatchSnapshot();
          },
        },
      );
  });
});
