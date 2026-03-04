import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["export/index.ts", "export/internal/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  external: ["rura"],
  dts: false,
  treeshake: true,
  clean: true,
});
