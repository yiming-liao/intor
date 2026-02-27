// @ts-check
import typescript from "@rollup/plugin-typescript";
import package_ from "../../package.json" with { type: "json" };
import { preserveDirectives } from "./plugins/preserve-directives.js";
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  // react
  "react",
  "react/jsx-runtime",
  // intor
  "intor",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/react/index": "export/react/index.ts",
    },
    output: {
      dir: "dist/react",
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
      fileSizeSummary(),
    ],
  },
];
