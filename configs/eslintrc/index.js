const typescript = require('./eslint-config-app-typescript');
const vue = require('./eslint-config-app-vue');


const config = {
  extends: [
    './eslint-config-app-vue',
    // './eslint-config-app-typescript',
    './eslint-config-app-import',
  ],
};

const overrides = [
  {
    files: [
      '**/src/**/*.{vue}',
    ],
    ...vue,
  },
  {
    files: [
      '**/src/**/*.{vue,ts,tsx}',
    ],
    ...typescript,
  },
  {
    files: [
      '**/tests/e2e/**/*.spec.{j,t}s?(x)',
    ],
  },
];

module.exports = config;

module.exports.overrides = overrides;
