module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Desliga as regras chatas
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off",
    "no-unused-vars": "off",
  },
};
