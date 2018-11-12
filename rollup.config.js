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

  // meh, we only import those for their types, but babel leaves the imports
  // there -_-
  external: ["mysql", "pg"],
  treeshake: {
    pureExternalModules: true,
  },

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
