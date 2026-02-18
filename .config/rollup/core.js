// @ts-check
import typescript from "@rollup/plugin-typescript";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = ["node:path", "node:fs/promises"];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/index": "export/index.ts",
      "export/internal/index": "export/internal/index.ts",
      "export/server/index": "export/server/index.ts",
      "export/edge/index": "export/edge/index.ts",
    },
    output: {
      dir: "dist/core",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      warn(warning);
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      fileSizeSummary(),
    ],
  },
];
