import {
  Percent as UniswapPercent,
} from '@uniswap/sdk-core';


export const ZERO_PERCENT = new UniswapPercent('0');
export const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new UniswapPercent(50, 10_000);
export const DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE = new UniswapPercent(5, 100);


const getUserSlippageTolerance = () => {
  const userSlippageTolerance: 'auto' | UniswapPercent = 'auto';
  return userSlippageTolerance === 'auto'
    ? 'auto'
    : new UniswapPercent(userSlippageTolerance, 10_000);
};

export const getUserSlippageToleranceWithDefault = (
  defaultSlippageTolerance: UniswapPercent,
) => {
  const allowedSlippage = getUserSlippageTolerance();
  return allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage;
};
