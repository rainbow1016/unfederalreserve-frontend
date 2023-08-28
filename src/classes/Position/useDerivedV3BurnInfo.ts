import { CurrencyAmount, Percent } from '@uniswap/sdk-core';
import { Position as UniswapPosition } from '@uniswap/v3-sdk';

import { Position } from './Position';
import { unwrappedToken } from './unwrappedToken';
import { useDerivedV3UnclaimedFeesInfo } from './useDerivedV3UnclaimedFeesInfo';

export function useDerivedV3BurnInfo(
  position: Position,
  percent: number,
  asWETH = false,
) {
  const { positionData, uniswapPool } = position;
  const { token0, token1 } = uniswapPool;

  const positionSDK = new UniswapPosition({
    pool: uniswapPool,
    liquidity: positionData.liquidity.toString(),
    tickLower: positionData.tickLower,
    tickUpper: positionData.tickUpper,
  });

  const liquidityPercentage = new Percent(percent, 100);

  const discountedAmount0 = liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient;
  const discountedAmount1 = liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient;

  const liquidityValue0 = CurrencyAmount.fromRawAmount(
    asWETH ? token0 : unwrappedToken(token0),
    discountedAmount0,
  );

  const liquidityValue1 = CurrencyAmount.fromRawAmount(
    asWETH ? token1 : unwrappedToken(token1),
    discountedAmount1,
  );

  const { feeValue0, feeValue1 } = useDerivedV3UnclaimedFeesInfo(position, asWETH);

  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange: !position.inRange,
  };
}
