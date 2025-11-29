// @ts-check
import typescript from "@rollup/plugin-typescript";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = ["node:path", "node:perf_hooks", "node:fs/promises"];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      // --- core
      "exports/index": "exports/index.ts",
      "exports/config/index": "exports/config/index.ts",
      "exports/server/index": "exports/server/index.ts",
    },
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      warn(warning);
    },
    plugins: [typescript({ tsconfig: "./tsconfig.json" }), fileSizeSummary()],
  },
];
