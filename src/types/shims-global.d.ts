declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'staging' | 'production' | 'development';
        VUE_APP_SHORT_NAME: string;
        BASE_URL: string;

        VUE_APP_ENV: 'dev' | 'master' | 'stage';

        VUE_APP_DOCS_LINK: string;
        VUE_APP_ABOUT_LINK: string;
        VUE_APP_LEGAL_API: string;

        VUE_APP_DEFAULT_NETWORK: 'mainnet' | 'rinkeby' | 'private';
        VUE_APP_STACKDRIVER_API_KEY: string;

        VUE_APP_MAINNET_API_URL: string;
        VUE_APP_MAINNET_ETHERSCAN_API_KEY: string;
        VUE_APP_MAINNET_INFURA_ID: string;
        VUE_APP_MAINNET_COMPTROLLER_ADDRESS: string;
        VUE_APP_MAINNET_COMPOUND_LENS_ADDRESS: string;
        VUE_APP_MAINNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESS: string;
        VUE_APP_MAINNET_V3_CORE_FACTORY_ADDRESS: string;
        VUE_APP_MAINNET_MULTICALL_ADDRESS: string;
        VUE_APP_MAINNET_V2_LP_TOKENS_ADDRESS: string;

        VUE_APP_RINKEBY_API_URL: string;
        VUE_APP_RINKEBY_ETHERSCAN_API_KEY: string;
        VUE_APP_RINKEBY_INFURA_ID: string;
        VUE_APP_RINKEBY_COMPTROLLER_ADDRESS: string;
        VUE_APP_RINKEBY_COMPOUND_LENS_ADDRESS: string;
        VUE_APP_RINKEBY_NONFUNGIBLE_POSITION_MANAGER_ADDRESS: string;
        VUE_APP_RINKEBY_V3_CORE_FACTORY_ADDRESS: string;
        VUE_APP_RINKEBY_MULTICALL_ADDRESS: string;
        VUE_APP_RINKEBY_V2_LP_TOKENS_ADDRESS: string;

        VUE_APP_PRIVATE_API_URL: string;
        VUE_APP_PRIVATE_ETHERSCAN_API_KEY: string;
        VUE_APP_PRIVATE_INFURA_ID: string;
        VUE_APP_PRIVATE_COMPTROLLER_ADDRESS: string;
        VUE_APP_PRIVATE_COMPOUND_LENS_ADDRESS: string;
        VUE_APP_PRIVATE_NONFUNGIBLE_POSITION_MANAGER_ADDRESS: string;
        VUE_APP_PRIVATE_V3_CORE_FACTORY_ADDRESS: string;
        VUE_APP_PRIVATE_MULTICALL_ADDRESS: string;
        VUE_APP_PRIVATE_V2_LP_TOKENS_ADDRESS: string;
        VUE_APP_PRIVATE_FAUCET: 'true' | 'false';


        VUE_APP_RELEASE_SHA: string;
        VUE_APP_RELEASE_BRANCH_NAME: string;
        VUE_APP_RELEASE_BUILD_DATE: string;
      }
    }
  }
}
