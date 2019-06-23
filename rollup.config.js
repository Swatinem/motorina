// @ts-check

import dts from "rollup-plugin-dts";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

const external = ["pg", "mysql"];

/** @type {Array<import("rollup").RollupWatchOptions>} */
const config = [
  {
    input: "./.build/index.js",
    output: [{ exports: "named", file: pkg.main, format: "cjs" }, { file: pkg.module, format: "es" }],

    external,

    plugins: [resolve()],
  },
  {
    input: "./.build/index.d.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
];

export default config;
