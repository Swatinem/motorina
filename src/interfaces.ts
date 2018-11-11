export interface Identifier {
  name: string;
  table?: string;
}

export interface BindParam {
  name: string;
}

export interface Literal {
  value: any;
}

export interface QueryBuilder {
  pushRaw(sql: string): void;
  pushIdentifier(id: Identifier): void;
  pushLiteral(value: unknown): void;
  pushParam(param: BindParam): void;
}

export interface QueryFragment {
  build(builder: QueryBuilder): void;
}
