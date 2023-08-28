

const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle';

export type IEnv = typeof env[keyof typeof env] & {
  ETHERSCAN_URL?: string;
  TX_URL?: string;
  ADDRESS_URL?: string;
};

const mainnet_network = {
  _CHAIN_ID: 1,
  _NETWORK_ID: 1,
  _NETWORK_NAME: 'mainnet',

  NETWORK_COLOR: '#24C0B3',
  NETWORK_URL: `https://mainnet.infura.io/v3/${process.env.VUE_APP_MAINNET_INFURA_ID}`,
  eRSDL_ADDRESS: '0x5218E472cFCFE0b64A064F055B43b4cdC9EfD3A6',

  API_URL: process.env.VUE_APP_MAINNET_API_URL,
  INFURA_ID: process.env.VUE_APP_MAINNET_INFURA_ID,
  ETHERSCAN_API_KEY: process.env.VUE_APP_MAINNET_ETHERSCAN_API_KEY,
  COMPTROLLER_ADDRESS: process.env.VUE_APP_MAINNET_COMPTROLLER_ADDRESS,
  COMPOUND_LENS_ADDRESS: process.env.VUE_APP_MAINNET_COMPOUND_LENS_ADDRESS,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESS: process.env.VUE_APP_MAINNET_NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
  V3_CORE_FACTORY_ADDRESS: process.env.VUE_APP_MAINNET_V3_CORE_FACTORY_ADDRESS,
  MULTICALL_ADDRESS: process.env.VUE_APP_MAINNET_MULTICALL_ADDRESS,
  V2_LP_TOKENS_ADDRESS: process.env.VUE_APP_MAINNET_V2_LP_TOKENS_ADDRESS,

  ETHERSCAN_URL: `${ETHERSCAN_BASE_URL}&apikey=${process.env.VUE_APP_MAINNET_ETHERSCAN_API_KEY}`,
  TX_URL: 'https://etherscan.io/tx/',
  ADDRESS_URL: 'https://etherscan.io/address/',
  FAUCET: false,
} as const;

const rinkeby_network = {
  _CHAIN_ID: 4,
  _NETWORK_ID: 4,
  _NETWORK_NAME: 'rinkeby',

  NETWORK_COLOR: '#F6C343',
  NETWORK_URL: `https://rinkeby.infura.io/v3/${process.env.VUE_APP_RINKEBY_INFURA_ID}`,
  eRSDL_ADDRESS: '0xe2BBB422caaCFcACc2Daa3Aee26b3f49591Db764',

  API_URL: process.env.VUE_APP_RINKEBY_API_URL,
  INFURA_ID: process.env.VUE_APP_RINKEBY_INFURA_ID,
  ETHERSCAN_API_KEY: process.env.VUE_APP_RINKEBY_ETHERSCAN_API_KEY,
  COMPTROLLER_ADDRESS: process.env.VUE_APP_RINKEBY_COMPTROLLER_ADDRESS,
  COMPOUND_LENS_ADDRESS: process.env.VUE_APP_RINKEBY_COMPOUND_LENS_ADDRESS,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESS: process.env.VUE_APP_RINKEBY_NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
  V3_CORE_FACTORY_ADDRESS: process.env.VUE_APP_RINKEBY_V3_CORE_FACTORY_ADDRESS,
  MULTICALL_ADDRESS: process.env.VUE_APP_RINKEBY_MULTICALL_ADDRESS,
  V2_LP_TOKENS_ADDRESS: process.env.VUE_APP_RINKEBY_V2_LP_TOKENS_ADDRESS,

  ETHERSCAN_URL: `${ETHERSCAN_BASE_URL}&apikey=${process.env.VUE_APP_RINKEBY_ETHERSCAN_API_KEY}`,
  TX_URL: 'https://rinkeby.etherscan.io/tx/',
  ADDRESS_URL: 'https://rinkeby.etherscan.io/address/',
  FAUCET: true,
} as const;

const private_network = {
  _CHAIN_ID: 1337,
  _NETWORK_ID: 1337,
  _NETWORK_NAME: 'private',

  NETWORK_COLOR: '#37f',
  // TODO: this is lie
  NETWORK_URL: `https://private.infura.io/v3/${process.env.VUE_APP_PRIVATE_INFURA_ID}`,
  eRSDL_ADDRESS: '0xe2BBB422caaCFcACc2Daa3Aee26b3f49591Db764',

  API_URL: process.env.VUE_APP_PRIVATE_API_URL,
  // TODO: this is lie
  INFURA_ID: process.env.VUE_APP_PRIVATE_INFURA_ID,
  ETHERSCAN_API_KEY: process.env.VUE_APP_PRIVATE_ETHERSCAN_API_KEY,
  COMPTROLLER_ADDRESS: process.env.VUE_APP_PRIVATE_COMPTROLLER_ADDRESS,
  COMPOUND_LENS_ADDRESS: process.env.VUE_APP_PRIVATE_COMPOUND_LENS_ADDRESS,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESS: process.env.VUE_APP_PRIVATE_NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
  V3_CORE_FACTORY_ADDRESS: process.env.VUE_APP_PRIVATE_V3_CORE_FACTORY_ADDRESS,
  MULTICALL_ADDRESS: process.env.VUE_APP_PRIVATE_MULTICALL_ADDRESS,
  V2_LP_TOKENS_ADDRESS: process.env.VUE_APP_PRIVATE_V2_LP_TOKENS_ADDRESS,

  // ETHERSCAN_URL
  // TX_URL
  // ADDRESS_URL
  FAUCET: process.env.VUE_APP_PRIVATE_FAUCET === 'true',
} as const;

export const env = {
  mainnet: mainnet_network,
  rinkeby: rinkeby_network,
  private: private_network,

  // eslint-disable-next-line no-underscore-dangle
  [mainnet_network._CHAIN_ID]: mainnet_network,
  // eslint-disable-next-line no-underscore-dangle
  [rinkeby_network._CHAIN_ID]: rinkeby_network,
  // eslint-disable-next-line no-underscore-dangle
  [private_network._CHAIN_ID]: private_network,
} as const;
