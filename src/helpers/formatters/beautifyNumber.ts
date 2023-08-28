import { stringDefaults } from '@/helpers/enums/params';
import { round } from './round';
import { formatToCurrency } from './formatToCurrency';


export const beautifyNumber = (n: number, isCurrency: boolean) => {
  // ToDo
  // Use BigNumber to protect from overflow
  // n:BigNumber
  let base = Math.floor(Math.log(Math.abs(n)) / Math.log(1000));
  const suffix = stringDefaults.ABBREV[Math.min(2, base - 1)];
  base = stringDefaults.ABBREV.indexOf(suffix) + 1;
  const rounded = round(n / 1000 ** base, 2);
  if (isCurrency) {
    return suffix && suffix.length > 0 ? formatToCurrency(rounded) + suffix : formatToCurrency(n);
  }
  return suffix && suffix.length > 0 ? rounded.toString() + suffix : n.toString();
  /*
  return isCurrency
    ? suffix
      ? formatToCurrency(rounded) + suffix
      : formatToCurrency(n)
    : suffix
    ? rounded.toString() + suffix
    : n;
  */
};
