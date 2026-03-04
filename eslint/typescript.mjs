import tseslint from "typescript-eslint";

export const typescriptConfig = [
  //  Typed strict rules for src
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["packages/*/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
  })),

  // Basic TS rules for tests
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["packages/*/__test__/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
  })),

  // Shared TS rules
  {
    files: ["packages/*/**/*.{ts,tsx}"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: true },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },
];
