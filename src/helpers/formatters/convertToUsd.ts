import { BigNumber, utils } from 'ethers';
import { formatUnits } from '@/helpers/formatUnits';


export function convertToUsd(
  value: BigNumber,
  underlyingPrice: BigNumber,
): number;

export function convertToUsd (
  value: string,
  underlyingPrice: BigNumber,
  underlyingDecimals: BigNumber,
): number;

export function convertToUsd(
  value: BigNumber | string,
  underlyingPrice: BigNumber,
  underlyingDecimals?: BigNumber,
) {
  let v: BigNumber;

  if (typeof value === 'string') {
    const fractionDigits = +(value.split('e-')[1]);

    const val = fractionDigits
      // 0.22e-15 -> 0.0000000022
      ? (+value || 0).toFixed(fractionDigits)
      : value;

    v = utils.parseUnits(
      val,
      underlyingDecimals,
    );
  } else {
    v = value;
  }

  const wei = v.mul(underlyingPrice);
  return +formatUnits(wei, 2 * 18);
}
