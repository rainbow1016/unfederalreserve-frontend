import { Rounding } from '@uniswap/sdk-core';
import { FeeAmount, TICK_SPACINGS, tickToPrice } from '@uniswap/v3-sdk';

import { Account } from '@/types/common.d';
import { Await } from '@/types/utils';
import { useCore } from '@/store';
import {
  createUniswapPoolMemoized as createUniswapPool,
  getUniswapTokenMemoized as getUniswapToken,
} from './utils';


export const useRangeHopCallbacks = async (
  baseAddress: string,
  quoteAddress: string,
  feeAmount: FeeAmount,
) => {
  const { account } = useCore();
  const { env, web3Provider } = account.value as unknown as Account;
  // eslint-disable-next-line no-underscore-dangle
  const chainId = env._CHAIN_ID;

  const promises = [
    createUniswapPool(env, web3Provider, baseAddress, quoteAddress, feeAmount).catch(() => null),
    getUniswapToken(chainId, web3Provider, baseAddress),
    getUniswapToken(chainId, web3Provider, quoteAddress),
  ] as const;

  const [pool, baseToken, quoteToken] = await Promise.all(promises);

  const getDecrementLower = (tickLower?: number) => {
    if (typeof tickLower === 'number' && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickLower - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }

    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }
    return '';
  };

  const getIncrementLower = (tickLower?: number) => {
    if (typeof tickLower === 'number' && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickLower + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }

    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }
    return '';
  };

  const getDecrementUpper = (tickUpper?: number) => {
    if (typeof tickUpper === 'number' && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickUpper - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }

    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }
    return '';
  };

  const getIncrementUpper = (tickUpper?: number) => {
    if (typeof tickUpper === 'number' && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickUpper + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }

    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(18, undefined, Rounding.ROUND_UP);
    }
    return '';
  };

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  };
};

type IMintInfo = {
  tickLower: number;
  tickUpper: number;
  invertPrice: boolean;
};

export const getLeftRightRangeCallbacks = (
  mintInfo: IMintInfo,
  ranges: Await<ReturnType<typeof useRangeHopCallbacks>>,
) => ({
  leftRange: {
    decrement: () => (
      mintInfo.invertPrice
        ? ranges.getIncrementUpper(mintInfo.tickUpper)
        : ranges.getDecrementLower(mintInfo.tickLower)
    ),

    increment: () => (
      mintInfo.invertPrice
        ? ranges.getDecrementUpper(mintInfo.tickUpper)
        : ranges.getIncrementLower(mintInfo.tickLower)
    ),
  },

  rightRange: {
    decrement: () => (
      mintInfo.invertPrice
        ? ranges.getIncrementLower(mintInfo.tickLower)
        : ranges.getDecrementUpper(mintInfo.tickUpper)
    ),

    increment: () => (
      mintInfo.invertPrice
        ? ranges.getDecrementLower(mintInfo.tickLower)
        : ranges.getIncrementUpper(mintInfo.tickUpper)
    ),
  },
});
