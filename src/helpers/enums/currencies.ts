
// eslint-disable-next-line no-undef
const importAll = (context: __WebpackModuleApi.RequireContext) => (
  context.keys().reduce((acc, key) => {
    // ./CREAM.svg -> CREAM
    const name = key.replace(/.\/(.*?)\.svg/, '$1');
    const value = context(key) as string;
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>)
);


const context = require.context('@/assets/images/currency/', false, /\.svg$/);

export const CURRENCIES = importAll(context);

CURRENCIES.WETH = CURRENCIES.WETH || CURRENCIES.ETH;
CURRENCIES.WBTC = CURRENCIES.WBTC || CURRENCIES.BTC;
CURRENCIES.legacy_eRSDL = CURRENCIES.legacy_eRSDL || CURRENCIES.eRSDL;
CURRENCIES.uneRSDL = CURRENCIES.eRSDL;
CURRENCIES['eRSDL (legacy)'] = CURRENCIES.legacy_eRSDL;
