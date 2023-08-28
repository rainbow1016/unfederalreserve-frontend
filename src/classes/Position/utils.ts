import { providers } from 'ethers';
import { memoizeAsyncify } from 'utils-decorators';

import {
  computePoolAddress,
  Pool as UniswapPool,
  Position as UniswapPosition,
  FeeAmount as UniswapFeeAmount,
  nearestUsableTick as UniswapNearestUsableTick,
  TickMath as UniswapTickMath,
  TICK_SPACINGS as UNISWAP_TICK_SPACINGS,
} from '@uniswap/v3-sdk';
import { Token as UniswapToken, WETH9 } from '@uniswap/sdk-core';

import { IEnv } from '@/global/env';
import { PositionsResponse } from '@/types/generated/uniswap/GNonfungiblePositionManager';
import { IUniswapV3PoolState } from '@/classes/IUniswapV3PoolState';
import { CToken } from '@/classes/CToken';
import {
  ETH_ADDRESS,
  DAI_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
} from '@/helpers/enums/params';


export const WETH9_EXTENDED_ADDRESSES = Object.values(WETH9).map((_) => _.address);

const STABLE_TOKEN_ADDRESSES = [DAI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS];
const BASE_TOKEN_ADDRESSES = [...WETH9_EXTENDED_ADDRESSES, WBTC_ADDRESS];

const getPriceOrderingFromPositionForUI = (position: UniswapPosition) => {
  const token0 = position.amount0.currency;
  const token1 = position.amount1.currency;

  // if token0 is a dollar-stable asset, set it as the quote token
  const isStableToken0 = STABLE_TOKEN_ADDRESSES.includes(token0.address);

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const isBaseToken1 = BASE_TOKEN_ADDRESSES.includes(token1.address);

  // if both prices are below 1, invert
  const isLessThanOne = position.token0PriceUpper.lessThan(1);

  if (isStableToken0 || isBaseToken1 || isLessThanOne) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  };
};

const formatPrice = (
  price: UniswapPosition['token0PriceUpper'] | undefined,
  sigFigs: number,
) => {
  if (!price) {
    return '-';
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    // return '<0.0001';
  }

  return price.toSignificant(sigFigs);
};

const formatTickPrice = (
  price: UniswapPosition['token0PriceUpper'] | undefined,
  atLimit: ReturnType<typeof getTickAtLimit>,
  direction: keyof typeof atLimit,
) => {
  if (atLimit[direction]) {
    return direction === 'LOWER' ? '0' : '∞';
  }

  return formatPrice(price, 18);
};

const getTickAtLimit = (
  feeAmount: number,
  tickLower: number,
  tickUpper: number,
) => {
  const LOWER = feeAmount && tickLower
    ? tickLower === UniswapNearestUsableTick(
      UniswapTickMath.MIN_TICK,
      UNISWAP_TICK_SPACINGS[feeAmount as UniswapFeeAmount],
    )
    : undefined;

  const UPPER = feeAmount && tickUpper
    ? tickUpper === UniswapNearestUsableTick(
      UniswapTickMath.MAX_TICK,
      UNISWAP_TICK_SPACINGS[feeAmount as UniswapFeeAmount],
    )
    : undefined;

  return { LOWER, UPPER };
};

const getPoolRatio = (
  lower: UniswapPosition['token0PriceLower'],
  current: UniswapPosition['token0PriceLower'],
  upper: UniswapPosition['token0PriceLower'],
) => {
  try {
    if (!current.greaterThan(lower)) {
      return 100;
    } if (!current.lessThan(upper)) {
      return 0;
    }

    const a = Number.parseFloat(lower.toSignificant(15));
    const b = Number.parseFloat(upper.toSignificant(15));
    const c = Number.parseFloat(current.toSignificant(15));


    const ratio = ((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100);

    if (ratio < 0 || ratio > 100) {
      return undefined;
    }

    return ratio; // Math.floor(ratio)
  } catch {
    return undefined;
  }
};

export const getUniswapPosition = (
  position: PositionsResponse,
  pool: UniswapPool,
) => {
  // eslint-disable-next-line object-curly-newline
  const { tickLower, tickUpper, liquidity } = position;

  // eslint-disable-next-line object-curly-newline
  const PositionConstructorArgs = { pool, liquidity: liquidity.toString(), tickLower, tickUpper };
  return new UniswapPosition(PositionConstructorArgs);
};

export const getPriceOrderingFromPosition = (
  positionData: PositionsResponse,
  pool: UniswapPool,
) => {
  // eslint-disable-next-line object-curly-newline
  const { fee, tickLower, tickUpper } = positionData;
  const tickAtLimit = getTickAtLimit(fee, tickLower, tickUpper);

  const uniswapPosition = getUniswapPosition(positionData, pool);
  const priceOrderingFromPosition = getPriceOrderingFromPositionForUI(uniswapPosition);

  const {
    priceLower,
    priceUpper,
    base,
    quote,
  } = priceOrderingFromPosition;

  const inverted = pool.token1 ? base?.equals(pool.token1) : undefined;

  const minPrice = formatTickPrice(
    inverted ? priceUpper.invert() : priceLower,
    tickAtLimit,
    inverted ? 'UPPER' : 'LOWER',
  );

  const maxPrice = formatTickPrice(
    inverted ? priceLower.invert() : priceUpper,
    tickAtLimit,
    inverted ? 'LOWER' : 'UPPER',
  );

  const ratio = getPoolRatio(
    inverted ? priceUpper.invert() : priceLower,
    pool.token0Price,
    inverted ? priceLower.invert() : priceUpper,
  );

  const amount0 = uniswapPosition.amount0.toFixed(pool.token0.decimals);
  const amount1 = uniswapPosition.amount1.toFixed(pool.token1.decimals);

  return {
    base,
    quote,
    minPrice,
    maxPrice,
    ratio,
    inverted,

    uniswapPosition,
    amount0: +amount0 === 0 ? '0' : amount0,
    amount1: +amount1 === 0 ? '0' : amount1,

    token0Price: uniswapPosition.pool.token0Price.toFixed(pool.token0.decimals),
    token1Price: uniswapPosition.pool.token1Price.toFixed(pool.token1.decimals),

    priceLower,
    priceUpper,
  };
};

const getUniswapToken = async (
  chainId: number,
  web3Provider: providers.Web3Provider,
  address: string,
) => {
  const isETH = address === ETH_ADDRESS;

  if (isETH) {
    return WETH9[chainId];
  }
  const cToken = new CToken(address, web3Provider, false);

  const promises = [
    cToken.methods.decimals(),
    cToken.methods.symbol(),
    cToken.methods.name(),
  ] as const;

  const [
    decimal,
    symbol,
    name,
  ] = await Promise.all(promises);

  const token = new UniswapToken(
    chainId,
    address,
    +decimal,
    symbol,
    name,
  );

  return token;
};

export const getUniswapTokenMemoized = memoizeAsyncify(getUniswapToken, {
  expirationTimeMs: 10 * 60 * 1000,
  keyResolver: (
    chainId: number,
    web3Provider: unknown,
    address: string,
  ) => [chainId, address].join('-'),
}) as typeof getUniswapToken;

export const getSortedUniswapTokens = async (
  chainId: number,
  web3Provider: providers.Web3Provider,
  token0Address: string,
  token1Address: string,
) => {
  const promises = [
    getUniswapTokenMemoized(
      chainId,
      web3Provider,
      token0Address,
    ),
    getUniswapTokenMemoized(
      chainId,
      web3Provider,
      token1Address,
    ),
  ];

  const [tokenA, tokenB] = await Promise.all(promises);

  const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

  return {
    token0: tokens[0],
    token1: tokens[1],
    tokenA,
    tokenB,
  };
};

const createUniswapPool = async (
  env: IEnv,
  web3Provider: providers.Web3Provider,
  token0Address: string,
  token1Address: string,
  fee: number,
) => {
  // eslint-disable-next-line no-underscore-dangle
  const chainId = env._CHAIN_ID;

  const tokens = await getSortedUniswapTokens(
    chainId,
    web3Provider,
    token0Address,
    token1Address,
  );

  const { token0, token1 } = tokens;

  const poolAddress = computePoolAddress({
    factoryAddress: env.V3_CORE_FACTORY_ADDRESS,
    tokenA: token0,
    tokenB: token1,
    fee, // 3000
  });

  const poolManager = new IUniswapV3PoolState(
    poolAddress,
    web3Provider,
  );

  const promises1 = [
    poolManager.methods.slot0(),
    poolManager.methods.liquidity(),
  ] as const;

  const [slot0, liquidity] = await Promise.all(promises1);

  const uniswapPool = new UniswapPool(
    token0,
    token1,
    fee,
    slot0.sqrtPriceX96.toString(),
    liquidity.toString(),
    slot0.tick,
  );

  return uniswapPool;
};

export const createUniswapPoolMemoized = memoizeAsyncify(createUniswapPool, {
  expirationTimeMs: 10 * 60 * 1000,
  keyResolver: (
    env: IEnv,
    web3Provider: providers.Web3Provider,
    token0Address: string,
    token1Address: string,
    fee: number,
  ) => [
    // eslint-disable-next-line no-underscore-dangle
    env._CHAIN_ID,
    token0Address,
    token1Address,
    fee,
  ].join('-'),
}) as typeof createUniswapPool;
