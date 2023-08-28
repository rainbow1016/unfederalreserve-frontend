import trimEnd from 'lodash/trimEnd';
import { BigNumber, utils } from 'ethers';


const { parseUnits } = utils;

export const formatUnits = (value: BigNumber, unit?: BigNumber | number): `${number}` => {
  const converted = utils.formatUnits(value, unit) as `${number}`;
  // 11.0 -> 11
  return trimEnd(trimEnd(converted, '0'), '.') as `${number}`;
};

// convert number to current unitNumber: 40116231761838033e-7 -> 0.0000000116231761838033
export const formatNumberToStringNumber = (value: number, decimals = 18) => {
  const decimalsInner = Math.max(0, 18 - value.toFixed(0).length);
  const val = (value * 10 ** decimalsInner).toString();
  const result = formatUnits(parseUnits(val), decimalsInner + decimals);
  return result;
};
