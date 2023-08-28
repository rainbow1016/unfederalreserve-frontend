
export const LEGACY_eRSDL_TOKENS = [
  // mainnet
  {
    chainId: 1,
    address: '0xe4cc5a22b39ffb0a56d67f94f9300db20d786a5f',
    underlying: '0x5218e472cfcfe0b64a064f055b43b4cdc9efd3a6',

    symbol: 'legacy_uneRSDL',
    name: 'unFederalReserveToken',
    underlyingSymbol: 'legacy_eRSDL',
  },
  // dev
  {
    chainId: 3,
    address: '0x9c9061444e8e47a69f2d14ab41adef794a05145b',
    underlying: '0xe2bbb422caacfcacc2daa3aee26b3f49591db764',

    symbol: 'legacy_uneRSDL',
    name: 'unFederalReserveToken',
    underlyingSymbol: 'legacy_eRSDL',
  },
  // stage
  {
    chainId: 3,
    address: '0xa236366c7e76274cc9d26ae229f533100fcbd8b4',
    underlying: '0xe2bbb422caacfcacc2daa3aee26b3f49591db764',

    symbol: 'legacy_uneRSDL',
    name: 'unFederalReserveToken',
    underlyingSymbol: 'legacy_eRSDL',
  },
  // private
  {
    chainId: 1337,
    address: '0x30ede7135369d07f26825b4c33c22fffa7cef458',
    underlying: '0x7db3c5772995f5ece0d1d0f2a904bfbb7e760a6d',

    symbol: 'legacy_uneRSDL',
    name: 'unFederalReserveToken',
    underlyingSymbol: 'legacy_eRSDL',
  },
];

export const LEGACY_eRSDL_TOKEN_MAP = LEGACY_eRSDL_TOKENS.reduce((acc, token) => {
  acc[token.address] = token;
  return acc;
}, {} as Record<string, typeof LEGACY_eRSDL_TOKENS[number]>);


export const HIDDEN_TOKENS = [
  // stage
  {
    chainId: 3,
    address: '0xcee811fef25a58252fbfe63472907e6c4fb7f476',
    underlying: '0x2b4f97f255eeecf9f90ab462147c00e796d9e9ac',

    symbol: 'uneRSDL',
    name: 'unFederalReserveToken',
    underlyingSymbol: 'eRSDL',
  },
];

export const HIDDEN_TOKEN_MAP = HIDDEN_TOKENS.reduce((acc, token) => {
  acc[token.address] = token;
  return acc;
}, {} as Record<string, typeof HIDDEN_TOKENS[number]>);
