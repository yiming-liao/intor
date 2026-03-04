// @ts-check
import esbuild from "rollup-plugin-esbuild";
import package_ from "../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  // intor
  "node:path",
  "node:fs/promises",
  // hono
  "hono",
  // intor
  "intor/edge",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/hono/index": "export/hono/index.ts",
    },
    output: {
      dir: "dist/hono",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      warn(warning);
    },
    plugins: [
      esbuild({
        target: "es2022",
        tsconfig: false,
        sourceMap: false,
        platform: "neutral",
      }),
      fileSizeSummary(),
    ],
  },
];
