import babel from "@rollup/plugin-babel";
import commonJS from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const PLUGINS = [
  peerDepsExternal(),
  resolve({ extensions }),
  typescript({ tsconfig: "./tsconfig.json" }),
  babel({
    extensions,
    babelHelpers: "bundled",
    include: ["src/**/*"],
  }),
  json(),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  }),
  commonJS(),
];

export default [
  // Main entry build (client and shared code)
  {
    input: "src/index.ts",
    external: ["react", "next"],
    output: [
      { file: pkg.exports["."].main, format: "cjs", sourcemap: true, banner: "'use client'" },
      { file: pkg.exports["."].module, format: "es", sourcemap: true, banner: "'use client'" },
    ],
    plugins: PLUGINS,
  },
  // Server entry build (server-only code)
  {
    input: "src/server/index.ts",
    output: [
      { file: pkg.exports["./server"].main, format: "cjs", sourcemap: true },
      { file: pkg.exports["./server"].module, format: "es", sourcemap: true },
    ],
    plugins: PLUGINS,
  },
];
