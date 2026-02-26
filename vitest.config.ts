import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        "src/**/types.ts",
        "src/core/types/**/*.ts",
        "src/config/types/*.ts",
        "src/adapters/**/*.ts",
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
    setupFiles: ["./vitest-setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
