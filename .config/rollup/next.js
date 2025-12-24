// @ts-check
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import package_ from "../../package.json" with { type: "json" };
import { preserveDirectives } from "./plugins/preserve-directives.js";
import { fileSizeSummary } from "./plugins/file-size-summary.js";

const EXTERNALS = [
  "node:path",
  "node:fs/promises",
  "react/jsx-runtime",
  "react",
  "next/server",
  "next/headers",
  "next/dist",
  "next/link",
  "next/navigation",
  "next/dist/shared/lib/router/utils/format-url",
  "intor/react", // intor module
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
      dir: "dist/next",
      format: "esm",
      preserveModules: true,
    },
    external: [...Object.keys(package_.dependencies ?? {}), ...EXTERNALS],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
      warn(warning);
    },
    plugins: [
      alias({
        entries: [
          /**
           * IMPORTANT:
           * Next adapter source (e.g. src/adapters/next/navigation/use-pathname.ts)
           * must import internal react contexts for TypeScript to work,
           * but at runtime it MUST consume the public `intor/react` context.
           *
           * This alias rewrites internal context imports to `intor/react`
           * to ensure a single React Context instance at runtime.
           */
          {
            find: "@/client/react/contexts/config",
            replacement: "intor/react",
          },
          {
            find: "@/client/react/contexts/locale",
            replacement: "intor/react",
          },
        ],
      }),
      typescript({ tsconfig: "./tsconfig.json", exclude: ["**/__test__/**"] }),
      preserveDirectives(),
      fileSizeSummary(),
    ],
  },
];
