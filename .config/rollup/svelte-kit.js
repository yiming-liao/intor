// @ts-check
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  // node
  "node:path",
  "node:fs/promises",
  // svelte
  "@sveltejs/kit",
  "svelte/store",
  "$app/navigation",
  "$app/state",
  // intor
  "intor/svelte/internal",
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      "export/svelte-kit/index": "export/svelte-kit/index.ts",
    },
    output: {
      dir: "dist/svelte-kit",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      warn(warning);
    },
    plugins: [
      // Prevent duplicate Svelte runtime by redirecting to `intor/svelte/internal`.
      alias({
        entries: [
          { find: "../../client/svelte", replacement: "intor/svelte/internal" },
        ],
      }),
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      fileSizeSummary(),
    ],
  },
];
