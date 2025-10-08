// eslint.config.js
import js from "@eslint/js";
import next from "eslint-config-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // Next 15-regler (inkl. core-web-vitals)
  ...next(),

  // Base JS-regler
  js.configs.recommended,

  // TypeScript + React i appen
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
        // Om du vil kjøre type-aware linting senere:
        // project: ["./tsconfig.json"]
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // no-undef klagde på window/process, men vi har nå browser+node globals.
      // Hvis du fortsatt får klager fra tredjeparts-typinger, kan du skru den av:
      // "no-undef": "off"
    }
  }
];
