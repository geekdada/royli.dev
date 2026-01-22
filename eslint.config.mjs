import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslint from '@eslint/js';

export default tseslint.config(
  {
    ignores: [".next/", "node_modules/", "public/"],
  },
  ...nextConfig,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
);
