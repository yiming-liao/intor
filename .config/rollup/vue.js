// @ts-check
import typescript from "@rollup/plugin-typescript";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = ["vue"];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/vue/index": "export/vue/index.ts",
    },
    output: {
      dir: "dist/vue",
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
