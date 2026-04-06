import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  treeshake: true,
  clean: true,
  tsconfig: "./tsconfig.build.json",
});
