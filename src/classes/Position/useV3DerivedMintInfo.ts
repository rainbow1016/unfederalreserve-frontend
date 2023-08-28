import JSBI from 'jsbi';
import { parseUnits } from '@ethersproject/units';
import {
  encodeSqrtRatioX96,
  Pool as UniswapPool,
  Position as UniswapPosition,
  FeeAmount as UniswapFeeAmount,
  tickToPrice as UniswapTickToPrice,
  nearestUsableTick as UniswapNearestUsableTick,
  priceToClosestTick as UniswapPriceToClosestTick,
  TickMath as UniswapTickMath,
  TICK_SPACINGS as UNISWAP_TICK_SPACINGS,
} from '@uniswap/v3-sdk';
import {
  Price as UniswapPrice,
  Token as UniswapToken,
  CurrencyAmount as UniswapCurrencyAmount,
} from '@uniswap/sdk-core';

import { useCore } from '@/store';
import { Account } from '@/types/common.d';
import { PoolToken } from '@/classes/PoolToken';
import {
  createUniswapPoolMemoized as createUniswapPool,
  getSortedUniswapTokens,
} from './utils';


export { PoolToken };

const BIG_INT_ZERO = JSBI.BigInt(0);

const tryParseAmount = (
  value: string,
  currency: UniswapToken,
) => {
  const valueValid = (() => {
    const [val1, val2] = value.split('.');
    if (!val2) return val1;
    return `${val1}.${val2.slice(0, currency.decimals)}`;
  })();

  try {
    const typedValueParsed = parseUnits(valueValid, currency.decimals).toString();
    if (typedValueParsed !== '0') {
      return UniswapCurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    // eslint-disable-next-line no-console
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
};

const tryParsePrice = (
  baseToken: UniswapToken,
  quoteToken: UniswapToken,
  value: string | number,
) => {
  const [whole, fraction] = (typeof value === 'number' ? value.toFixed(18) : value).split('.');

  const decimals = fraction?.length ?? 0;
  const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''));

  return new UniswapPrice(
    baseToken,
    quoteToken,
    JSBI.multiply(JSBI.BigInt(10 ** decimals), JSBI.BigInt(10 ** baseToken.decimals)),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
  );
};

const tryParseTick = (
  baseToken: UniswapToken,
  quoteToken: UniswapToken,
  feeAmount: UniswapFeeAmount,
  value: string | number,
) => {
  const price = tryParsePrice(baseToken, quoteToken, value);

  let tick: number;

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, UniswapTickMath.MAX_SQRT_RATIO)) {
    tick = UniswapTickMath.MAX_TICK;
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, UniswapTickMath.MIN_SQRT_RATIO)) {
    tick = UniswapTickMath.MIN_TICK;
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = UniswapPriceToClosestTick(price);
  }

  return UniswapNearestUsableTick(tick, UNISWAP_TICK_SPACINGS[feeAmount]);
};

export const enum FieldTypes {
  CurrencyA = 'CURRENCY_A',
  CurrencyB = 'CURRENCY_B',
}

export const tryGetUniswapPool = async (
  address0: string,
  address1: string,
  feeAmount: UniswapFeeAmount,
) => {
  const account = useCore().account.value as unknown as Account;
  const { env, web3Provider } = account;

  try {
    const result = await createUniswapPool(
      env,
      web3Provider,
      address0,
      address1,
      feeAmount,
    );

    return result;
  } catch {
    return null;
  }
};

export const useV3DerivedMintInfo = async (
  token0Data: PoolToken,
  token1Data: PoolToken,
  leftRange: string,
  rightRange: string,
  feeAmount: UniswapFeeAmount,
  positionData?: { tickLower: number; tickUpper: number },
  independentField: FieldTypes = FieldTypes.CurrencyA,
) => {
  const typedValue = independentField === FieldTypes.CurrencyA ? token0Data.value : token1Data.value;

  const account = useCore().account.value as unknown as Account;
  const { env, web3Provider } = account;

  const [tokens, uniswapPoolFined] = await Promise.all([
    // eslint-disable-next-line no-underscore-dangle
    getSortedUniswapTokens(env._CHAIN_ID, web3Provider, token0Data.address, token1Data.address),
    tryGetUniswapPool(token0Data.address, token1Data.address, feeAmount),
  ]);

  const startPriceTypedValue = uniswapPoolFined
    ? uniswapPoolFined.token0Price.toFixed(18)
    : token1Data.price_usd / token0Data.price_usd;

  // eslint-disable-next-line object-curly-newline
  const { token0, token1, tokenA, tokenB } = tokens;

  // note to parse inputs in reverse
  const invertPrice = !token0.equals(tokenA);

  const noLiquidity = !uniswapPoolFined;

  // always returns the price with 0 as base token
  const price = (() => {
    // if no liquidity use typed value
    if (noLiquidity) {
      const parsedQuoteAmount = tryParseAmount(startPriceTypedValue.toString(), tokenA);
      if (!parsedQuoteAmount) return void 0;
      const baseAmount = tryParseAmount('1', tokenB);
      if (!baseAmount) return void 0;

      const result = new UniswapPrice(
        baseAmount.currency,
        parsedQuoteAmount.currency,
        baseAmount.quotient,
        parsedQuoteAmount.quotient,
      );

      return invertPrice ? result.invert() : result;
    }

    // get the amount of quote currency
    return uniswapPoolFined ? uniswapPoolFined.priceOf(uniswapPoolFined.token0) : undefined;
  })();

  const uniswapPool = uniswapPoolFined || (() => {
    if (!price) return void 0;

    const currentTick = UniswapPriceToClosestTick(price);
    const currentSqrt = UniswapTickMath.getSqrtRatioAtTick(currentTick);
    return new UniswapPool(token0, token1, feeAmount, currentSqrt, JSBI.BigInt(0), currentTick, []);
  })();

  const currencies = {
    [FieldTypes.CurrencyA]: tokenA,
    [FieldTypes.CurrencyB]: tokenB,
  };

  const dependentField = independentField === FieldTypes.CurrencyA ? FieldTypes.CurrencyB : FieldTypes.CurrencyA;

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick

  const tickLower = positionData?.tickLower ?? (invertPrice
    ? tryParseTick(token1, token0, feeAmount, rightRange)
    : tryParseTick(token0, token1, feeAmount, leftRange));

  const tickUpper = positionData?.tickUpper ?? (invertPrice
    ? tryParseTick(token1, token0, feeAmount, leftRange)
    : tryParseTick(token0, token1, feeAmount, rightRange));

  const lowerPrice = UniswapTickToPrice(token0, token1, tickLower);
  const upperPrice = UniswapTickToPrice(token0, token1, tickUpper);

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === 'number'
    && typeof tickUpper === 'number'
    && tickLower >= tickUpper,
  );

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === 'number'
    && uniswapPool
    && uniswapPool.tickCurrent >= tickUpper,
  );

  const deposit1Disabled = Boolean(
    typeof tickLower === 'number'
    && uniswapPool
    && uniswapPool.tickCurrent <= tickLower,
  );

  // liquidity range warning
  const outOfRange = Boolean(
    price && lowerPrice && upperPrice
    && (price.lessThan(lowerPrice) || price.greaterThan(upperPrice)),
  );

  // amounts
  const independentAmount = tryParseAmount(
    typedValue.toString(),
    currencies[independentField],
  );

  const dependentAmount = (() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency = dependentField === 'CURRENCY_B' ? tokenB : tokenA;

    const withValues = !!(
      independentAmount
      && wrappedIndependentAmount
      && typeof tickLower === 'number'
      && typeof tickUpper === 'number'
      && uniswapPool
    );

    if (!withValues) return void 0;

    // if price is out of range or invalid range - return 0 (single deposit will be independent)
    if (outOfRange) return undefined;

    const position = wrappedIndependentAmount.currency.equals(uniswapPool.token0)
      ? UniswapPosition.fromAmount0({
        pool: uniswapPool,
        tickLower,
        tickUpper,
        amount0: independentAmount.quotient,
        // we want full precision for the theoretical position
        useFullPrecision: true,
      })
      : UniswapPosition.fromAmount1({
        pool: uniswapPool,
        tickLower,
        tickUpper,
        amount1: independentAmount.quotient,
      });

    const dependentTokenAmount = wrappedIndependentAmount.currency.equals(uniswapPool.token0)
      ? position.amount1 : position.amount0;

    return (
      dependentCurrency
      && UniswapCurrencyAmount.fromRawAmount(
        dependentCurrency,
        dependentTokenAmount.quotient,
      )
    );
  })();

  const parsedAmounts = {
    [FieldTypes.CurrencyA]: independentField === FieldTypes.CurrencyA ? independentAmount : dependentAmount,
    [FieldTypes.CurrencyB]: independentField === FieldTypes.CurrencyA ? dependentAmount : independentAmount,
  };

  // create position entity based on users selection
  const uniswapPosition = (() => {
    if (!uniswapPool) {
      return void 0;
    }

    // mark as 0 if disabled because out of range
    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[tokenA.equals(uniswapPool.token0) ? FieldTypes.CurrencyA : FieldTypes.CurrencyB]?.quotient
      : BIG_INT_ZERO;
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[tokenA.equals(uniswapPool.token0) ? FieldTypes.CurrencyB : FieldTypes.CurrencyA]?.quotient
      : BIG_INT_ZERO;

    if (
      amount0 === undefined
      || amount1 === undefined
    ) {
      return void 0;
    }

    return UniswapPosition.fromAmounts({
      pool: uniswapPool,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      // we want full precision for the theoretical position
      useFullPrecision: true,
    });
  })();

  const leftRangeCurrent = invertPrice ? upperPrice.invert().toFixed(18) : lowerPrice.toFixed(18);
  const rightRangeCurrent = invertPrice ? lowerPrice.invert().toFixed(18) : upperPrice.toFixed(18);

  let amount0: string | undefined = void 0;
  let amount1: string | undefined = void 0;

  if (uniswapPosition) {
    amount0 = uniswapPosition.amount0.toFixed(uniswapPool?.token0.decimals);
    amount1 = uniswapPosition.amount1.toFixed(uniswapPool?.token1.decimals);

    amount0 = +amount0 === 0 ? '0' : amount0;
    amount1 = +amount1 === 0 ? '0' : amount1;
  }

  // sorted for token order
  const depositADisabled = (
    invalidRange
    || invertPrice ? deposit1Disabled : deposit0Disabled
  );

  const depositBDisabled = (
    invalidRange
    || invertPrice ? deposit0Disabled : deposit1Disabled
  );

  return {
    deposit0Disabled,
    deposit1Disabled,

    depositADisabled,
    depositBDisabled,

    lowerPrice,
    upperPrice,

    leftRangeCurrent,
    rightRangeCurrent,

    tickLower,
    tickUpper,

    uniswapPool,
    uniswapPoolFined,
    uniswapPosition,

    outOfRange,
    noLiquidity,
    invalidRange,
    invertPrice,

    amount0,
    amount1,
  };
};
