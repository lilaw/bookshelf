module.exports = {
  root: true,
  env: {
    node: true,
  },
  overrides: [
    /**
     * tests file
     */
    {
      
      files: ["*.ts", "*.tsx", "*.vue", "*.js"],

      extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint",
      ],
      parserOptions: {
        ecmaVersion: 2020,
      },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
    },
    /**
     * tests file
     */
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
    /**
     * test config
     */
    {
      extends: ["plugin:node/recommended"],
      files: ["jest.config.js"],
      env: { commonjs: true, node: true },
    },
  ],
};
