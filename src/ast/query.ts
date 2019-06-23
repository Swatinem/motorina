import { Node } from "./node";
import { Builder } from "./builder";

// See https://github.com/diesel-rs/diesel/blob/c723424f324f0f4ea030c1f2bca21dab4a2599ca/diesel/src/query_builder/select_statement/mod.rs#L39
export class Select implements Node {
  constructor(public select: Array<Node>, public from?: Node, public where?: Node) {}
  build(builder: Builder) {
    builder.pushRaw("SELECT ");

    // TODO: distinct

    let comma = "";
    for (const select of this.select) {
      select.build(builder);

      builder.pushRaw(comma);
      comma = ", ";
    }

    if (this.from) {
      builder.pushRaw(" FROM ");
      this.from.build(builder);
    }

    if (this.where) {
      builder.pushRaw(" WHERE ");
      this.where.build(builder);
    }

    // TODO: group by
    // TODO: order
    // TODO: limit
    // TODO: offset
  }
}
