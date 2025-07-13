import type { Options } from "tsup";
import path from "node:path";
import { defineConfig } from "tsup";

const externals = [
  "react",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-dom",
  "react-dom/client",
  "next",
  "next/head",
  "next/router",
  "next/navigation",
];

const base: Options = {
  format: ["esm", "cjs"],
  dts: true,
  treeshake: true,
  clean: false,
  // sourcemap: true,
  esbuildOptions(options) {
    options.alias = { "@": path.resolve(__dirname, "src") };
    options.external = [...(options.external ?? []), ...externals];
  },
};

export default defineConfig([
  {
    ...base,
    entry: ["exports/index.ts"],
    outDir: "dist",
    clean: true,
  },
  {
    ...base,
    entry: ["exports/config/index.ts"],
    outDir: "dist/config",
    clean: true,
  },
  // Next
  {
    ...base,
    entry: ["exports/next/index.ts"],
    outDir: "dist/next",
    clean: true,
  },
  {
    ...base,
    entry: ["exports/next/middleware/index.ts"],
    outDir: "dist/next/middleware",
    clean: true,
  },
]);
