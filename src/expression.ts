import { QueryFragment, QueryBuilder } from "./interfaces";
import { CustomType } from "./columns";

// Generic Expression

export abstract class Expression implements QueryFragment {
  build(_builder: QueryBuilder) {}

  eq(expr: Expression): Expression {
    return new Eq(this, expr);
  }

  and(expr: Expression): Expression {
    return new And(this, expr);
  }

  or(expr: Expression): Expression {
    return new Or(this, expr);
  }

  isNull(): Expression {
    return new IsNull(this);
  }

  // as(name: string): Expression {
  //   return new As(this, new Id(name));
  // }
}

// Operators

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

function WrappingOperator(before: string, after?: string) {
  return class extends Expression {
    constructor(private middle: QueryFragment) {
      super();
    }
    public build(builder: QueryBuilder) {
      builder.pushRaw(before);
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

// export const As = InfixOperator(" AS ");

// Atoms

export class Id extends Expression {
  constructor(private name: string, private table?: string) {
    super();
  }
  public build(builder: QueryBuilder) {
    const { name, table } = this;
    builder.pushIdentifier({ name, table });
  }
}
export function id(name: string, table?: string) {
  return new Id(name, table);
}

export class Param extends Expression {
  constructor(private name: string) {
    super();
  }
  public build(builder: QueryBuilder) {
    builder.pushParam({ name: this.name });
  }
}
export function param(name: string) {
  return new Param(name);
}

export class Lit extends Expression {
  constructor(private value: any) {
    super();
  }
  public build(builder: QueryBuilder) {
    builder.pushLiteral(this.value);
  }
}
export function lit<T>(value: T, type?: CustomType<T>) {
  if (type) {
    return new Lit(type.encode(value));
  }
  return new Lit(value);
}
