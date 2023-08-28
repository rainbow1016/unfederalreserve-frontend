export const formatSymbol = (symbol: string, isRemove = false, isShort = false) => (
  symbol.includes('legacy')
    // eslint-disable-next-line no-nested-ternary
    ? symbol.replace(/legacy_(.*)/, isRemove ? '$1' : isShort ? '$1(legacy)' : '$1 (legacy)')
    : symbol
);
