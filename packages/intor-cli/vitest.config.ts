import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/**/index.ts", "src/**/types.ts"],
      reporter: ["lcov", "text"],
      thresholds: {
        global: { statements: 90, branches: 90 },
        "src/core/**": { statements: 100, branches: 100 },
        "src/features/**": { statements: 100, branches: 100 },
        "src/infrastructure/**": { statements: 100, branches: 100 },
      },
    },
  },
});
