// @ts-check
import esbuild from "rollup-plugin-esbuild";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  // node
  "node:path",
  "node:fs/promises",
  // intor
  "intor/server",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/express/index": "export/express/index.ts",
    },
    output: {
      dir: "dist/express",
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
