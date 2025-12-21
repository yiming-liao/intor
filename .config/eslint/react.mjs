import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export const reactConfig = [
  {
    files: ["src/**/*.{tsx,ts}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // React 17+ automatic JSX runtime
      "react/react-in-jsx-scope": "off",
      // TypeScript handles props typing
      "react/prop-types": "off",
      // Correctness (from react/recommended)
      "react/jsx-no-undef": "error",
      "react/no-unknown-property": "error",
      // Hooks (from react-hooks/recommended)
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
];
