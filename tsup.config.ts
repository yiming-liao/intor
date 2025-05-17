import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/intor/core/intor/index.ts",
      config: "src/intor/core/intor-config/index.ts",
      translator: "src/intor/core/intor-translator/index.ts",
      error: "src/intor/core/intor-error/index.ts",
      logger: "src/intor/core/intor-logger/index.ts",
      "messages-loader": "src/intor/core/intor-messages-loader/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist",
    clean: true,
    treeshake: true,
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".js" : ".cjs",
      };
    },
    external: [/^@intor\//],
  },
]);
