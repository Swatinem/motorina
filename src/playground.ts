import { QueryBuilder } from "./builder";
import { As, Count, Eq } from "./operators";
import { id, lit } from "./atoms";

const builder = new QueryBuilder();

console.log(
  builder.build(
    new As(new Count(new Eq(id("foo", "table"), lit("foo"))), id("foo"))
  )
);

console.log(
  builder.build(
    id("foo", "table")
      .eq(lit("foo"))
      .as("foo")
  )
);
