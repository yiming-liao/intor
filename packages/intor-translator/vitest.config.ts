import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        "src/**/types.ts",
        "src/types/**/*.ts",
        "pipeline/types/**.ts",
      ],
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
