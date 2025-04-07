import babel from "@rollup/plugin-babel";
import commonJS from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";

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
  {
    input: "src/index.ts",
    external: ["react", "next"],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, banner: "'use client'" },
      { file: pkg.module, format: "es", sourcemap: true, banner: "'use client'"},
    ],
    plugins: PLUGINS,
  },
  // UMD build with inline PropTypes
  {
    input: "src/index.ts",
    external: ["react", "'next/image'"],
    output: [
      {
        name: "ImageKitNext",
        file: pkg.browser,
        format: "umd",
        globals: {
          react: "React",
          "next/image": "NextImage",
        },
        sourcemap: true,
        banner: "'use client'"
      },
    ],
    plugins: PLUGINS,
  },
  // Minified UMD Build With PropTypes
  {
    input: "src/index.ts",
    output: [
      {
        name: "ImageKitNext",
        file: pkg["browser:min"],
        format: "umd",
        globals: {
          react: "React",
          "next/image": "NextImage",
        },
        sourcemap: true,
        banner: "'use client'"
      },
    ],
    plugins: [...PLUGINS, terser()],
  },
];
