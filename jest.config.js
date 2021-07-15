const fs = require("fs");

module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
    "\\.[jt]sx?$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: ["node_modules/(?!(debounce-fn|my-project|)/)"],
  roots: ["<rootDir>/src"],
  setupFiles: [require.resolve("whatwg-fetch")],
  setupFilesAfterEnv: fs.existsSync("src/setupTests.ts")
    ? ["<rootDir>/src/setupTests.ts"]
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
