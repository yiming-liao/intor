// @ts-check
import typescript from "@rollup/plugin-typescript";
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
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      fileSizeSummary(),
    ],
  },
];
