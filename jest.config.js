const resolve = require('resolve')
const fs = require("fs");

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  testMatch: ["**/__tests__/**/*.ts"],
  roots: ["<rootDir>/src"],
  testEnvironment: resolve.sync('jest-environment-jsdom', {
    basedir: require.resolve('jest'),
  }),
  setupFiles: [require.resolve('whatwg-fetch')],
  setupFilesAfterEnv: fs.existsSync("src/setupTests.js")
    ? ["<rootDir>/src/setupTests.js"]
    : [],
    resetMocks: true,
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
