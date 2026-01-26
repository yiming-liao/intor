// @ts-check
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import package_ from "../../package.json" with { type: "json" };
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  "node:path",
  "node:fs/promises",
  "@sveltejs/kit",
  "svelte/store",
  "$app/navigation",
  "$app/state",
  "intor/svelte", // intor module
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: {
      // svelte-kit
      "export/svelte-kit/index": "export/svelte-kit/index.ts",
      "export/svelte-kit/server/index": "export/svelte-kit/server/index.ts",
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
      alias({
        entries: [{ find: "@/client/svelte", replacement: "intor/svelte" }],
      }),
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      fileSizeSummary(),
    ],
  },
];
