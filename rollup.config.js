import resolve from "rollup-plugin-node-resolve";
import sucrase from "rollup-plugin-sucrase";
import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],

  plugins: [
    resolve({
      jsnext: true,
      extensions: [".ts"],
    }),
    sucrase({
      exclude: ["node_modules/**"],
      transforms: ["typescript"],
    }),
  ],
};
