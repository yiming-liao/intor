// @ts-check
import esbuild from "rollup-plugin-esbuild";
import package_ from "../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";
import { preserveDirectives } from "./plugins/preserve-directives.js";

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
      "export/react/internal/index": "export/react/internal/index.ts",
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
      esbuild({
        target: "es2022",
        tsconfig: false,
        sourceMap: false,
        platform: "neutral",
      }),
      preserveDirectives(),
      fileSizeSummary(),
    ],
  },
];
