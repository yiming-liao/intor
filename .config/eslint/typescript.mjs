import tseslint from "typescript-eslint";

export const typescriptConfig = [
  { plugins: { "@typescript-eslint": tseslint.plugin } },

  // src
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
  })),

  // test
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
  })),

  // shared
  {
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },
];
