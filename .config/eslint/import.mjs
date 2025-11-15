import importPlugin from "eslint-plugin-import";

export const importConfig = [
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-unresolved": ["error", { caseSensitive: true }],
      "import/newline-after-import": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "type", // Type-only files
            "builtin", // e.g. "node:path"
            "external", // e.g. "logry"
            "internal", // e.g. "@/hooks/foo"
            "parent", // e.g. "../utils"
            "sibling", // e.g. "./Button"
            "index", // // e.g. "./index.ts"
            "object", // JSON files, ...
            "unknown",
          ],
          "newlines-between": "never", // No empty lines between
          alphabetize: { order: "asc", caseInsensitive: true }, // a-Z && aA-zZ
        },
      ],
    },
  },
];
