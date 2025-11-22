import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { importConfig } from "./.config/eslint/import.mjs";
import { typescriptConfig } from "./.config/eslint/typescript.mjs";
import { unicornConfig } from "./.config/eslint/unicorn.mjs";
import { unusedImportsConfig } from "./.config/eslint/unused-imports.mjs";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  globalIgnores([
    ".yarn/**",
    ".config/**",
    "eslint.config.mjs",
    "dist",
    "coverage",
  ]),

  // JS
  js.configs.recommended,
  ...typescriptConfig,
  ...unicornConfig,
  ...importConfig,
  ...unusedImportsConfig,

  {
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
    },
  },

  // Prettier
  {
    files: ["src/**/*.{ts}"],
    plugins: { prettier: prettierPlugin },
    rules: { "prettier/prettier": "warn" },
  },
]);

export default eslintConfig;
