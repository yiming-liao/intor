import type { Options } from "tsup";
import path from "node:path";
import { defineConfig } from "tsup";

const EXTERNALS = [
  "react",
  "react-dom",
  "next",
  "next/server",
  "next/headers",
  "next/link",
  "next/navigation",
  "next/dist/shared/lib/router/router",
  "next/dist/shared/lib/router/utils/format-url",
  "next/dist/shared/lib/app-router-context.shared-runtime",
];

const base: Options = {
  format: ["esm", "cjs"],
  dts: true,
  treeshake: true,
  clean: true,
  // sourcemap: true,
  esbuildOptions(options) {
    options.alias = { "@": path.resolve(__dirname, "src") };
    options.external = [...(options.external ?? []), ...EXTERNALS];
  },
};

export default defineConfig([
  {
    ...base,
    entry: ["exports/index.ts"],
    outDir: "dist",
  },
  {
    ...base,
    entry: ["exports/config/index.ts"],
    outDir: "dist/config",
  },
  // Next
  {
    ...base,
    entry: ["exports/next/index.ts"],
    outDir: "dist/next",
  },
  {
    ...base,
    entry: ["exports/next/middleware/index.ts"],
    outDir: "dist/next/middleware",
  },
  {
    ...base,
    entry: ["exports/next/server/index.ts"],
    outDir: "dist/next/server",
  },
]);
