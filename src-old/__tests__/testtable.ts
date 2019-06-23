import { Table } from "./";

export const test1 = new Table("test1")
  .columns({
    id: Number,
    name: String,
  })
  .build();
