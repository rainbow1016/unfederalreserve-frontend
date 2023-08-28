const path = require('path');


const config = {
  extends: [
    'plugin:import/recommended',
  ],
  plugins: [
    'import',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // Path aliases for imports in WebStorm
          // https://stackoverflow.com/a/50076645
          ['@', path.resolve(__dirname, '../../src')],
        ],
        extensions: [
          '.js',
          '.vue',
          '.json',
          '.ts',
          '.d.ts',
        ],
      },
    },
  },
  rules: {
    'import/first': 0,
    'import/order': [0, {
      groups: [
        'builtin',
        'external',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'never',
    }],
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/no-unresolved': 2,
    'import/no-cycle': 2,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/extensions': ['error', {
      js: 'never',
      json: 'always',
      ts: 'never',
      'd.ts': 'never',
      vue: 'always',
    }],

    'sort-imports': 'off',
    'simple-import-sort/sort': 'off',
  },
};

module.exports = config;
