// @ts-check
import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-plugin-preserve-directives";
import package_ from "../../package.json" with { type: "json" };
import { removeExternalImports } from "./plugins/remove-external-imports.js";
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  "node:path",
  "node:perf_hooks",
  "node:fs/promises",
  "react",
  "react/jsx-runtime",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      // --- react
      "export/react/index": "export/react/index.ts",
    },
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
      warn(warning);
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      preserveDirectives(),
      removeExternalImports(),
      fileSizeSummary(),
    ],
  },
];
