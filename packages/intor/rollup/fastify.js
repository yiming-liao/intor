// @ts-check
import esbuild from "rollup-plugin-esbuild";
import package_ from "../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  // node
  "node:path",
  "node:fs/promises",
  // fastify
  "fastify",
  "fastify-plugin",
  // intor
  "intor/server",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/fastify/index": "export/fastify/index.ts",
    },
    output: {
      dir: "dist/fastify",
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
