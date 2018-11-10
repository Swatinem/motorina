import { Expression } from "./expression";
import { QueryFragment, QueryBuilder } from "./interfaces";

function InfixOperator(operator: string) {
  return class extends Expression {
    constructor(private left: QueryFragment, private right: QueryFragment) {
      super();
    }
    public build(builder: QueryBuilder) {
      this.left.build(builder);
      builder.pushRaw(operator);
      this.right.build(builder);
    }
  };
}

function WrappingOperator(before?: string, after?: string) {
  return class extends Expression {
    constructor(private middle: QueryFragment) {
      super();
    }
    public build(builder: QueryBuilder) {
      if (before) {
        builder.pushRaw(before);
      }
      this.middle.build(builder);
      if (after) {
        builder.pushRaw(after);
      }
    }
  };
}

// See https://github.com/diesel-rs/diesel/blob/5629f6dae55e615b79ba54a3ebc01902b96240e8/diesel/src/expression/operators.rs#L339-L359
export const Eq = InfixOperator(" = ");

export const And = InfixOperator(" AND ");
export const Or = InfixOperator(" OR ");

export const Not = WrappingOperator("NOT ");
export const IsNull = WrappingOperator("", " IS NULL");

export const Count = WrappingOperator("COUNT(", ")");

// TODO: In, NotIn

export const As = InfixOperator(" AS ");
