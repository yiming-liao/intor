import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // ignores
  {
    ignores: ["dist/**", "coverage/**"],
  },
  // basic js
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  // prettier
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { prettier: prettierPlugin },
    extends: [prettierConfig],
    rules: {
      "prettier/prettier": "error",
    },
  },
  // import sort
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { import: importPlugin },
    rules: {
      "import/named": "off",
      "import/no-named-as-default": "off",
      "import/newline-after-import": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "unknown",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  // unused imports
  {
    plugins: { "unused-imports": unusedImportsPlugin },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Default
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
]);
