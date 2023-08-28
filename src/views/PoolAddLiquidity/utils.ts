import trimEnd from 'lodash/trimEnd';
import { useCore } from '@/store';
import { Account } from '@/types/common.d';
import { PoolToken } from '@/classes/PoolToken';
import { formatPercentDisplay, formatToNumber, formatToCurrencyDisplay } from '@/helpers/formatters';
import { toFixed } from '@/helpers/toFixed';
import { POOL_SUPPORTED_FEES } from '@/helpers/enums/pools';


export const getPoolOptions = (
  tokens: string[],
) => {
  const account = useCore().account.value as Account;

  const result = account.markets
    .filter((market) => tokens.includes(market.symbol))
    .map((market) => PoolToken.buildClass(market));

  return result;
};

export const getPoolTokenPercentsByRanges = (
  tokenA: PoolToken,
  tokenB: PoolToken,
  leftRange: number,
  rightRange: number,
) => {
  const tokenPrice = tokenA.price_usd
    ? tokenB.price_usd / tokenA.price_usd
    : 0;

  const minPercent = (100 * leftRange) / tokenPrice - 100;
  const maxPercent = (100 * rightRange) / tokenPrice - 100;

  return {
    minPercent,
    maxPercent,
  };
};

const parseNumber = (
  number: number | string,
  fractionDigits: number,
  defaultFractionDigits = number > 1 ? Math.max(0, 5 - (+number).toFixed(0).length) : 8,
  format = true,
) => {
  if (+number < 1e-6) {
    return typeof number === 'number' ? (+number).toFixed(18) : number;
  }

  let result = +(+number).toFixed(defaultFractionDigits) === 0
    ? (+number).toFixed(fractionDigits)
    : (+number).toFixed(defaultFractionDigits);

  result = format ? formatToNumber(+result, +result > 10 ? 2 : Infinity) : result;

  if (!result.includes('.')) return result;

  const [whole, fraction] = result.split('.');

  return trimEnd(`${whole}.${trimEnd(fraction, '0')}`, '.');
};

const parsePercent = (
  number: number,
) => {
  let result = 100 * (number - 1);
  result = Math.round(100 * result) / 100;
  return Number(toFixed(result, 2));
};

const enum TokensDataInfoTypes {
  leftRange = 'leftRange',
  rightRange = 'rightRange',
}

const createPoolTokensDataInfoInner = (
  tokenA: PoolToken,
  tokenB: PoolToken,
  fee: typeof POOL_SUPPORTED_FEES[number],
  tokenPrice: number | `${number}`,
  leftRange: number | `${number}`,
  rightRange: number | `${number}`,
  priceUSD: number,
  inverted: boolean,
) => {
  const leftPercent = parsePercent(+leftRange / +tokenPrice);
  const rightPercent = parsePercent(+rightRange / +tokenPrice);

  const symbolA = tokenA.symbol;
  const symbolB = tokenB.symbol;

  const currencyText = `${symbolB} per ${symbolA}`;
  const commission = formatPercentDisplay(fee / 10_000);

  const decimals = Math.min(
    tokenA.decimals,
    tokenB.decimals,
  );

  const tokenPriceFormatted = parseNumber(+tokenPrice, decimals, +tokenPrice > 1 ? 3 : 8);
  const leftRangeFormatted = parseNumber(leftRange, decimals);
  const rightRangeFormatted = parseNumber(rightRange, decimals);

  const leftRangeUsd = +leftRange * priceUSD;
  const rightRangeUsd = +rightRange * priceUSD;

  const leftInfo = {
    title: 'Min Price',
    value: parseNumber((+leftRange).toFixed(18), decimals, void 0, false),
    value_f: leftRangeFormatted,
    percent: leftPercent,
    percent_f: formatPercentDisplay(leftPercent),
    currencyText,
    decimals: tokenA.decimals,
    priceUsd: formatToCurrencyDisplay(leftRangeUsd),
    tokenPrice: +tokenPrice,
    type: inverted ? TokensDataInfoTypes.rightRange : TokensDataInfoTypes.leftRange,
    helpText: `Your position will be 100% composed  of ${symbolA} at this price`,
  };

  const rightInfo = {
    title: 'Max Price',
    value: parseNumber((+rightRange).toFixed(18), decimals, void 0, false),
    value_f: rightRangeFormatted,
    percent: rightPercent,
    percent_f: formatPercentDisplay(rightPercent),
    currencyText,
    decimals: tokenB.decimals,
    priceUsd: formatToCurrencyDisplay(rightRangeUsd),
    tokenPrice: +tokenPrice,
    type: inverted ? TokensDataInfoTypes.leftRange : TokensDataInfoTypes.rightRange,
    helpText: `Your position will be 100% composed of ${symbolB} at this price`,
  };

  return {
    title: symbolA,
    commission: `${commission} fee tier`,
    tokenPrice: `${tokenPriceFormatted} ${symbolB} per ${symbolA}`,
    tokenPriceUsd: +tokenPrice * priceUSD,
    leftRange,
    rightRange,
    leftInfo,
    rightInfo,
    info: [leftInfo, rightInfo],
  };
};

export const createPoolTokensDataInfo = (
  tokenA: PoolToken,
  tokenB: PoolToken,
  fee: typeof POOL_SUPPORTED_FEES[number],
  tokenPrice: number | `${number}`,
  leftRange: number | `${number}`,
  rightRange: number | `${number}`,
  inverted: boolean,
) => (
  createPoolTokensDataInfoInner(
    inverted ? tokenB : tokenA,
    inverted ? tokenA : tokenB,
    fee,
    inverted ? 1 / +tokenPrice : +tokenPrice,
    inverted ? 1 / +rightRange : leftRange,
    inverted ? 1 / +leftRange : rightRange,
    inverted ? tokenA.price_usd : tokenB.price_usd,
    inverted,
  ));
