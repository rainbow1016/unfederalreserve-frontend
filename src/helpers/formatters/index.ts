import { MIN_TOKEN_VALUE } from '@/helpers/enums/params';

import { beautifyNumber } from './beautifyNumber';
import { preciseRound } from './preciseRound';
import { toFixed } from '@/helpers/toFixed';
import { formatToCurrency } from './formatToCurrency';
import { formatToNumber } from './formatToNumber';


export * from './beautifyNumber';
export * from './convertToUsd';
export * from './formatToCurrency';
export * from './formatToDate';
export * from './formatToNumber';
export * from './preciseRound';


export const formatBalance = (value: number | `${number}`) => (
  value !== 0 && value < MIN_TOKEN_VALUE
    ? toFixed(value, 12)
    : beautifyNumber(preciseRound(value), false)
);


const MIN_DISPLAY_USD_BALANCE = 0.01;
const MIN_DISPLAY_TOKEN_VALUE = 0.01;
const MIN_DISPLAY_PERCENT_VALUE = 0.01;

export const formatToCurrencyDisplay = (
  value: number,
  maximumFractionDigits: number | null = 2,
  compact = false,
) => (
  +value && Math.abs(value) < MIN_DISPLAY_USD_BALANCE
    ? `< ${+value < 0 ? '-' : ''}$${MIN_DISPLAY_USD_BALANCE}`
    : formatToCurrency(value, maximumFractionDigits, compact)
);

export const formatBalanceDisplay = (
  value: string | number,
  minValue = MIN_DISPLAY_TOKEN_VALUE,
) => (
  +value && Math.abs(+value) < minValue
    ? `< ${+value < 0 ? '-' : ''}${minValue}`
    : formatBalance(+value)
);

export const formatPercentDisplay = (value: string | number) => (
  +value && Math.abs(+value) < MIN_DISPLAY_PERCENT_VALUE
    ? `< ${+value < 0 ? '-' : ''}${MIN_DISPLAY_PERCENT_VALUE}%`
    : `${formatToNumber(preciseRound(+value))}%`
);
