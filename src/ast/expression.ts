import { Node } from "./node";
import { Builder } from "./builder";

export class Raw implements Node {
  constructor(public raw: string) {}
  build(builder: Builder) {
    builder.pushRaw(this.raw);
  }
}

export class Identifier implements Node {
  constructor(public id: string) {}
  build(builder: Builder) {
    builder.pushIdentifier(this.id);
  }
}

export class Literal implements Node {
  constructor(public value: unknown) {}
  build(builder: Builder) {
    builder.pushLiteral(this.value);
  }
}

export class Placeholder implements Node {
  constructor(public name: string) {}
  build(builder: Builder) {
    builder.pushPlaceholder(this.name);
  }
}

export class Call implements Node {
  constructor(public name: Node, public args: Array<Node>) {}
  build(builder: Builder) {
    this.name.build(builder);
    builder.pushRaw("(");
    let comma = "";
    for (const arg of this.args) {
      arg.build(builder);

      builder.pushRaw(comma);
      comma = ", ";
    }
    builder.pushRaw(")");
  }
}

// Operators
function InfixOperator(operator: string) {
  return class implements Node {
    constructor(public left: Node, public right: Node) {}
    public build(builder: Builder) {
      this.left.build(builder);
      builder.pushRaw(operator);
      this.right.build(builder);
    }
  };
}

function PrefixOperator(operator: string) {
  return class implements Node {
    constructor(public node: Node) {}
    public build(builder: Builder) {
      builder.pushRaw(operator);
      this.node.build(builder);
    }
  };
}

function PostfixOperator(operator: string) {
  return class implements Node {
    constructor(public node: Node) {}
    public build(builder: Builder) {
      this.node.build(builder);
      builder.pushRaw(operator);
    }
  };
}

export const Dot = InfixOperator(".");

// See https://github.com/diesel-rs/diesel/blob/c723424f324f0f4ea030c1f2bca21dab4a2599ca/diesel/src/expression/operators.rs#L364-L384

export const Eq = InfixOperator(" = ");

export const And = InfixOperator(" AND ");
export const Or = InfixOperator(" OR ");

// infix_operator!(Concat, " || ", ReturnBasedOnArgs);
// infix_operator!(Between, " BETWEEN ");
// infix_operator!(Escape, " ESCAPE ");
// infix_operator!(Gt, " > ");
// infix_operator!(GtEq, " >= ");
// infix_operator!(Like, " LIKE ");
// infix_operator!(Lt, " < ");
// infix_operator!(LtEq, " <= ");
// infix_operator!(NotBetween, " NOT BETWEEN ");
// infix_operator!(NotEq, " != ");
// infix_operator!(NotLike, " NOT LIKE ");

export const IsNull = PostfixOperator(" IS NULL");

// postfix_operator!(IsNotNull, " IS NOT NULL");
// postfix_operator!(Asc, " ASC", ());
// postfix_operator!(Desc, " DESC", ());

export const Not = PrefixOperator("NOT ");
