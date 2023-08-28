import { Account, IPositionData } from '@/types/common.d';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { formatToNumber } from '@/helpers/formatters';

type TPosition = Account['positions'][number];
type IToken = TPosition['uniswapPool']['token0'] | TPosition['uniswapPool']['token1'];


export const getTokenNames = (token?: IToken) => {
  let symbol = token?.symbol || 'UNKNOWN';
  if (symbol === 'WETH') symbol = 'ETH';

  return {
    symbol,
    icon: symbol && CURRENCIES[symbol],
  };
};

const formatMinOrMax = (number: number | string = '-') => {
  if (Number.isNaN(+number)) return number;
  const short = (+number).toFixed(8);
  if (short === '0') return number;
  const isBig = +number > 100_000;
  return number < 1 ? short : formatToNumber(+short, isBig ? 0 : 3, isBig);
};

export const getPoolOverviewData = (position?: TPosition): IPositionData => {
  const {
    base,
    quote,
    inverted = false,
    positionData,
    isClosed = false,
    inRange = false,
    tokenId,
  } = position || {};

  const tokenA = getTokenNames(quote);
  const tokenB = getTokenNames(base);

  const minPrice = position
    ? formatMinOrMax(inverted ? position.minPrice : 1 / +position.maxPrice)
    : '-';

  const maxPrice = position
    ? formatMinOrMax(inverted ? position.maxPrice : 1 / +position.minPrice)
    : '-';

  return {
    tokenA,
    tokenB,
    tokenId,

    fee: positionData?.fee as IPositionData['fee'],

    isClosed,
    inRange,

    minPrice,
    maxPrice,
  };
};
