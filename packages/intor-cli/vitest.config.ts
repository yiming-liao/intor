import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["**/__fixtures__/**"],
      reporter: ["lcov", "text"],
    },
  },
});
