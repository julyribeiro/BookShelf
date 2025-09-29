import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended, 
  ...compat.extends("next/core-web-vitals"), 
  {
    ignores: [
    "src/generated/**", 
    "src/generated/prisma/**", 
    "**/runtime/**",
    "**/wasm-**",  
    "**/node_modules/**",
    "**/.prisma/**",
    ],
    
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", 
      },
    },
  }
);