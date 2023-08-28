require('ts-node').register({
  compilerOptions: {
    module: 'CommonJS',
  },
});

const config = require('./vue.config.ts').default;

module.exports = config;
