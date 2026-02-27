// @ts-check
import typescript from "@rollup/plugin-typescript";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";
import copy from "rollup-plugin-copy";

const EXTERNALS = [
  // svelte
  "svelte",
  "svelte/store",
  /\.svelte$/, // Keep .svelte components as external
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/svelte/index": "export/svelte/index.ts",
      "export/svelte/internal/index": "export/svelte/internal/index.ts",
    },
    output: {
      dir: "dist/svelte",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      warn(warning);
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      // Keep Svelte provider as source file (compiled by consumer)
      copy({
        targets: [
          {
            src: "src/client/svelte/provider/intor-provider.svelte",
            dest: "dist/svelte/src/client/svelte/provider",
          },
          {
            src: "src/client/svelte/provider/intor-provider.d.ts",
            dest: "dist/types/src/client/svelte/provider",
          },
        ],
      }),
      fileSizeSummary(),
    ],
  },
];
