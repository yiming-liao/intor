import tseslint from "typescript-eslint";

export const typescriptConfig = [
  ...tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "../../tsconfig.json",
      },
    },
  },

  {
    files: [".config/**", "eslint.config.mjs", "postcss.config.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
];
