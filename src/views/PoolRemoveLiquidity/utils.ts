import { Position } from '@/types/common.d';
import { CURRENCIES } from '@/helpers/enums/currencies';


export const getTokenData = (
  token: Position['base'] | Position['quote'],
  value: string,
  unclaimed: `${number}` | undefined,
  percent: number,
  asWETH: boolean,
) => ({
  icon: token.symbol && CURRENCIES[token.symbol],
  symbol: (asWETH ? token.symbol : token.symbol?.replace(/^WETH$/, 'ETH')) || 'UNKNOWN',
  value: (percent && (+value * percent) / 100).toString(),
  unclaimed,
});
