import unicornPlugin from "eslint-plugin-unicorn";

export const unicornConfig = [
  unicornPlugin.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "unicorn/filename-case": ["error", { cases: { kebabCase: true } }],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/prefer-export-from": "off",
      "unicorn/no-null": "off",
      "unicorn/no-negated-condition": "off",
      "unicorn/no-lonely-if": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-console-spaces": "off",
      "unicorn/no-nested-ternary": "off",
    },
  },
];
