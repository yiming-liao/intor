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
  "react/jsx-runtime",
  "react",
  "next/server",
  "next/headers",
  "next/dist",
  "next/link",
  "next/navigation",
  "next/dist/shared/lib/router/utils/format-url",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      // --- next
      "export/next/index": "export/next/index.ts",
      "export/next/proxy/index": "export/next/proxy/index.ts",
      "export/next/server/index": "export/next/server/index.ts",
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
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      preserveDirectives(),
      removeExternalImports(),
      fileSizeSummary(),
    ],
  },
];
