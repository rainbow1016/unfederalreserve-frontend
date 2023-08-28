export const MIN_USD_BALANCE = 0.001;
export const MIN_TOKEN_VALUE = 1e-6;


export const NON_BREAKING_SPACE = String.fromCharCode(160);

export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // chainId = 1
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // chainId = 1
export const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // chainId = 1
export const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'; // chainId = 1

export const enum CalculationsDefaults {
  ETH_MANTISSA = 1e18,
  BLOCKS_PER_DAY = 6570, // 13.15 seconds per block // 4 * 60 * 24,
  DAYS_PER_YEAR = 365,
}

export const enum stringDefaults {
  ABBREV = 'KMB',
  FORMAT_STYLE = 'currency',
  CURRENCY = 'USD',
}

export const NETWORK_NAME_MAP = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
  42: 'Kovan Test Network',
  1337: 'Private Test Network',
  6284: 'Goerli Test Network',
  DEFAULT: 'Unknown Network',
} as const;


export const NETWORK_SHORT_NAME_MAP: Record<keyof typeof NETWORK_NAME_MAP, string> = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  1337: 'Private',
  6284: 'Goerli',
  DEFAULT: 'Private',
} as const;

export const TRANSACTION_STATUSES = {
  CONFIRMED: 1,
  PENDING: 2,
  FAILED: 3,
} as const;

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUSES.CONFIRMED]: 'Transaction confirmed',
  [TRANSACTION_STATUSES.PENDING]: 'Transaction pending',
  [TRANSACTION_STATUSES.FAILED]: 'Transaction failed',
  DEFAULT: 'Transaction',
} as const;

// eslint-disable-next-line max-len
export const INPUT_RULE = /^0$|^[1-90]\d{0,20}$|^(?=[1-90]\d*[.]\d*$).{1,20}$|^(?=0[.]\d*$).{1,20}|^(?=[.]\d*$).{1,20}$/gm;
