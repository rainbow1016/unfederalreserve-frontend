const checkEnvConfig = () => {
  // eslint-disable-next-line global-require, import/extensions
  const { env } = require('../../src/global/env.ts');

  const withEmpties = Object.values(env)
    .flatMap(Object.values)
    .some((variable) => (
      [undefined, ''].includes(variable) || /^\$\{.*\}$/.test(variable)
    ));

  if (withEmpties) {
    const env_string = JSON.stringify(env, null, 2);
    throw new Error(`Not all env settled" \n${env_string}`);
  }
};

module.exports.checkEnvConfig = checkEnvConfig;
