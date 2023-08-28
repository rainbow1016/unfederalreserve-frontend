import { CurrencyAmount } from '@uniswap/sdk-core';

import { Position } from './Position';
import { unwrappedToken } from './unwrappedToken';


export function useDerivedV3UnclaimedFeesInfo(
  position: Position,
  asWETH = false,
) {
  const { token0, token1 } = position.uniswapPool;

  const feeValue0 = CurrencyAmount.fromRawAmount(
    asWETH ? token0 : unwrappedToken(token0),
    position.unclaimedAmount0?.toString() as string,
  );

  const feeValue1 = CurrencyAmount.fromRawAmount(
    asWETH ? token1 : unwrappedToken(token1),
    position.unclaimedAmount1?.toString() as string,
  );

  return {
    feeValue0,
    feeValue1,
  };
}
