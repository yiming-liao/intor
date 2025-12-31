import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import { typescriptConfig } from "./.config/eslint/typescript.mjs";
import { importConfig } from "./.config/eslint/import.mjs";
import { unicornConfig } from "./.config/eslint/unicorn.mjs";
import { unusedImportsConfig } from "./.config/eslint/unused-imports.mjs";
import { reactConfig } from "./.config/eslint/react.mjs";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  globalIgnores([
    ".yarn/**",
    ".config/**",
    "eslint.config.mjs",
    "dist",
    "coverage",
    "examples",
    "**/*.d.ts",
  ]),

  // JS
  js.configs.recommended,
  ...typescriptConfig,
  ...unicornConfig,
  ...importConfig,
  ...unusedImportsConfig,
  ...reactConfig,

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
