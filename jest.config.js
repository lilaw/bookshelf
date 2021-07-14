const resolve = require("resolve");
const fs = require("fs");

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  roots: ["<rootDir>/src"],
  setupFiles: [require.resolve("whatwg-fetch")],
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
