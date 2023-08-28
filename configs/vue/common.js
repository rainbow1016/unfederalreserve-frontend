const { DateTime } = require('luxon');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');


const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const date = DateTime.local().toFormat(DATE_FORMAT);

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const environment = dotenv.config();
dotenvExpand(environment);

// eslint-disable-next-line no-multi-assign
environment.parsed.VUE_APP_RELEASE_BUILD_DATE = process.env.VUE_APP_RELEASE_BUILD_DATE = (
  process.env.VUE_APP_RELEASE_BUILD_DATE
  || date
);

module.exports.isProd = isProd;
module.exports.isDev = isDev;
module.exports.environment = environment.parsed || {};
