import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    // tsd / type tests
    "__test__/**",
    "**/*.test-d.ts",

    // public export entry points
    "export/**",

    // adapters (conditionally used)
    "src/adapters/**",

    // client / server runtime (framework-specific)
    "src/client/**",
    "src/server/**",

    // build & tooling
    ".config/**",
    "scripts/**",
  ],

  ignoreDependencies: ["@eslint/js"],
  ignoreBinaries: ["tsx"],
  rules: {
    devDependencies: "off",
  },
};

export default config;
