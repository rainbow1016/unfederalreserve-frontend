import { toFixed } from '@/helpers/toFixed';


export const preciseRound = (number: number | `${number}`) => {
  // eslint-disable-next-line no-bitwise
  let countZero = !number ? -1 : -Math.floor(Math.log10(+number) + 1);
  countZero = countZero > 0 ? countZero + 2 : 2;
  return +toFixed(number, countZero);
};

/*
export const preciseRound = (number: number) => {
  // eslint-disable-next-line no-bitwise
  const fractionDigits = Math.max(1, 2 + Math.log10(Math.abs(number)));
  const value = number.toExponential(fractionDigits);
  return parseFloat(value);
};
*/
