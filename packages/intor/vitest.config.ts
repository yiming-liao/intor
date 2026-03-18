import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/index.ts",
        "src/**/types.ts",
        "src/core/types/**/*.ts",
        "src/config/types/*.ts",
        "src/**/augmentation.ts",
      ],
      reporter: ["lcov", "text"],
      thresholds: {
        global: { statements: 90, branches: 90 },
        "src/core/**": { statements: 100, branches: 100 },
        "src/config/**": { statements: 100, branches: 100 },
        "src/routing/**": { statements: 100, branches: 100 },
        "src/policies/**": { statements: 100, branches: 100 },
        "src/edge/**": { statements: 100, branches: 100 },
        "src/server/**": { statements: 100, branches: 100 },
      },
    },
  },
});
