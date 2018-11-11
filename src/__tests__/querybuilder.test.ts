import { forDialect } from "./connection";
import { test1 } from "./testtable";

forDialect(conn => {
  it("should build a simple query", () => {
    const sql = test1.table.select(test1.columns).execute(conn);
    expect(sql).toMatchSnapshot();
  });
  it("should correctly escape literals", () => {
    const sql = test1.table
      .select(test1.columns)
      .filter(test1.columns.id.eq(123))
      .execute(conn);
    expect(sql).toMatchSnapshot();
  });
});
