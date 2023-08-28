
type T1 = { symbol: string }
type T2 = { underlyingSymbol: string }

const sortList = ['USDC', 'USDT', 'DAI', 'ETH', 'WBTC', 'LINK', 'AAVE', 'YFI', 'SUSHI', 'MATIC', 'eRSDL', 'legacy_eRSDL'];

const createSortMarkets = <T extends T1 | T2>(key: keyof T) => (
  (a: T, b: T) => {
    const valueA = a[key] as unknown as string;
    const valueB = b[key] as unknown as string;

    return sortList.indexOf(valueA) - sortList.indexOf(valueB);
  }
);

export const sortMarkets = createSortMarkets('symbol');

export const sortMarketsByUnderlying = createSortMarkets('underlyingSymbol');
