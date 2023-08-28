const { overrides } = require('./configs/eslintrc/index')


const overrides_units = {
  files: [
    '**/__tests__/*.{j,t}s?(x)',
    '**/tests/unit/**/*.spec.{j,t}s?(x)',
  ],
  env: {
    jest: true,
    node: true,
  },
}

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    project: [
      'tsconfig.json',
    ],
    sourceType: 'module',
    extraFileExtensions: [
      '.vue',
    ],
  },
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    '@vue/airbnb',
    './configs/eslintrc/index',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',

    'no-multiple-empty-lines': ['error', {
      max: 2,
    }],
    camelcase: 'off',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'require-await': 'error',
    'no-void': 0,
    'max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state',
        'acc',
        'e',
      ],
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'promise/no-return-wrap': ['error', {
      allowReject: true,
    }],
  },
  overrides: [
    ...overrides,
    overrides_units,
  ],
}
