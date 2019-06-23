import { Builder } from "./builder";

export interface Node {
    build(builder: Builder): void
}