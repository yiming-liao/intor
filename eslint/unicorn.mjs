import unicornPlugin from "eslint-plugin-unicorn";

export const unicornConfig = [
  {
    plugins: { unicorn: unicornPlugin },
    rules: {
      "unicorn/filename-case": ["error", { cases: { kebabCase: true } }],
    },
  },
];
