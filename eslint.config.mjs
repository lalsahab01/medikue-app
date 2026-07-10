import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Loading data into state on mount (localStorage, polling fetches) is an intended
      // pattern across the client dashboards; treat this stylistic rule as a warning.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
