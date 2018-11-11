import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
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
    babel({
      exclude: ["node_modules/**"],
      extensions: [".ts"],
    }),
  ],
};
