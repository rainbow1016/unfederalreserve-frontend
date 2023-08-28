export const POOL_SUPPORTED_TOKEN_MAP = {
  ETH: {
    symbol: 'ETH',
    fee: 3000,
    position: 0,
  },
  USDT: {
    symbol: 'USDT',
    fee: 10000,
    position: 1,
  },
  USDC: {
    symbol: 'USDC',
    fee: 10000,
    position: 2,
  },
};

export const POOL_SUPPORTED_TOKEN_A_LIST = [
  'eRSDL',
];

export const POOL_SUPPORTED_TOKEN_B_LIST = Object.keys(POOL_SUPPORTED_TOKEN_MAP);

export const POOL_SUPPORTED_FEES = [
  500,
  3000,
  10000,
] as const;
