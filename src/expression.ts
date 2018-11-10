import { QueryFragment, QueryBuilder } from "./interfaces";
import { Eq, And, Or, IsNull, As } from "./operators";
import { Id } from "./atoms";

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

  as(name: string): Expression {
    return new As(this, new Id(name));
  }
}
