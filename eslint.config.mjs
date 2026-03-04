import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import { importConfig } from "./eslint/import.mjs";
import { reactConfig } from "./eslint/react.mjs";
import { typescriptConfig } from "./eslint/typescript.mjs";
import { unicornConfig } from "./eslint/unicorn.mjs";
import { unusedImportsConfig } from "./eslint/unused-imports.mjs";

const eslintConfig = defineConfig([
  globalIgnores([
    ".yarn/**",
    "**/.rollup.cache/**",
    "**/dist/**",
    "**/scripts/**",
    "**/coverage/**",
    "**/bench/**",
    "**/examples/**",
    "**/__test__/types/**",
    "**/vitest*.ts",
    "**/tsup.config.ts",
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
        typescript: {
          project: ["./packages/*/tsconfig.json"],
          noWarnOnMultipleProjects: true,
        },
      },
    },
  },

  // Prettier
  {
    files: ["packages/*/**/*.{ts,tsx,js,jsx}"],
    ignores: ["**/*.d.ts"],
    plugins: { prettier: prettierPlugin },
    rules: { "prettier/prettier": "warn" },
  },
]);

export default eslintConfig;
