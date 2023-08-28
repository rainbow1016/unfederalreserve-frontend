import { stringDefaults } from '@/helpers/enums/params';


const DEFAULT_OPTIONS = {
  style: stringDefaults.FORMAT_STYLE,
  currency: stringDefaults.CURRENCY,
};

export const formatToCurrency = (
  number: number,
  maximumFractionDigits: number | null = 2,
  compact = false,
) => {
  const numberString = number < 1e-6 ? number.toFixed(18) : number.toString();

  const maximumFractionDigitsVal = maximumFractionDigits === null
    ? numberString.split('.')[1]?.length
    : maximumFractionDigits;

  const options = {
    ...DEFAULT_OPTIONS,
    maximumFractionDigits: maximumFractionDigitsVal,
    notation: compact ? 'compact' : void 0,
  } as const;

  return Intl.NumberFormat('en-US', options).format(number);
};
