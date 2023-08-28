import { BigNumber } from '@ethersproject/bignumber';


// add 20% (except on optimism)
export const calculateGasMargin = (value: BigNumber) => (
  value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
);
