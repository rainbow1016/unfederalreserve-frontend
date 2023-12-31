module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/tests/__mocks__/styleMock.js',
    'enums/currencies\\.ts$': '<rootDir>/tests/__mocks__/currenciesMock.js',
    'enums/currencies$': '<rootDir>/tests/__mocks__/currenciesMock.js',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
