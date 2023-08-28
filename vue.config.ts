import { ProjectOptions } from '@vue/cli-service';
import sassLoaderPackage from 'sass-loader/package.json';

import { environment, isProd } from './configs/vue/common';
import { checkEnvConfig } from './configs/vue/checkEnvConfig';


checkEnvConfig();

const title = [
  environment.VUE_APP_ENV === 'master' ? '' : environment.VUE_APP_ENV.toUpperCase(),
  'ReserveLending | P2P DeFi Lending platform | unFederalReserve | Earn APY today',
].filter(Boolean).join(' | ');

if (!process.argv.includes('--silent')) {
  // eslint-disable-next-line no-console
  console.log({ title, ...environment });
}

// for <= v8 prependData, else - additionalData
const additionalDataKey = parseFloat(sassLoaderPackage.version) < 9 ? 'prependData' : 'additionalData';

export const projectOptions: ProjectOptions = {
  lintOnSave: false,

  pages: {
    index: {
      entry: 'src/main.ts',
      title,
    },
  },

  css: {
    sourceMap: true,
    extract: isProd,
    loaderOptions: {
      // @ts-ignore typing is broken
      scss: {
        [additionalDataKey]: `
          @import
            "@/assets/scss/variables.scss",
            "@/assets/scss/mixins.scss";
        `,
      },
    },
  },

  configureWebpack: {
    optimization: !isProd ? void 0 : {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        name: true,
      },
    },
  },
};

export default projectOptions;
