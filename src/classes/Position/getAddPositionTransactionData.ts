import {
  Pool as UniswapPool,
  Position as UniswapPosition,
  NonfungiblePositionManager as UniswapNonfungiblePositionManager,
} from '@uniswap/v3-sdk';
import {
  NativeCurrency,
} from '@uniswap/sdk-core';

import { Position, PoolToken } from '@/types/common.d';
import { POOL_SUPPORTED_FEES } from '@/helpers/enums/pools';
import { useCore } from '@/store';
import { useV3DerivedMintInfo, FieldTypes } from '@/classes/Position/useV3DerivedMintInfo';
import { calculateGasMargin } from './calculateGasMargin';
import { getTransactionDeadline } from './getTransactionDeadline';
import {
  getUserSlippageToleranceWithDefault,
  ZERO_PERCENT,
  DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
} from './getUserSlippageToleranceWithDefault';
import { unwrappedToken } from './unwrappedToken';


const getTransactionData = async (
  pool: UniswapPool,
  position: UniswapPosition,
  tokenId?: string,
  outOfRange = false,
  noLiquidity = false,
) => {
  const { account, appEnv } = useCore();
  if (!account.value || !appEnv.value) return void 0;

  const { ethAccount } = account.value;
  const { NONFUNGIBLE_POSITION_MANAGER_ADDRESS } = appEnv.value;

  const baseCurrency = unwrappedToken(pool.token0);
  const quoteCurrency = unwrappedToken(pool.token1);

  // custom from users settings
  const deadline = await getTransactionDeadline();

  const allowedSlippage = getUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  );

  const useNative = (
    // eslint-disable-next-line no-nested-ternary
    baseCurrency.isNative
      ? baseCurrency : quoteCurrency.isNative
        ? quoteCurrency : undefined
  ) as unknown as NativeCurrency;

  const { calldata, value } = tokenId // for edit
    ? UniswapNonfungiblePositionManager.addCallParameters(position, {
      tokenId,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
      useNative,
    })
    : UniswapNonfungiblePositionManager.addCallParameters(position, {
      slippageTolerance: allowedSlippage,
      recipient: ethAccount,
      deadline: deadline.toString(),
      useNative,
      createPool: noLiquidity,
    });

  const txn = {
    to: NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
    data: calldata,
    value,
  };

  const estimateGas = await account.value.web3Provider.getSigner().estimateGas(txn);
  const gasLimit = calculateGasMargin(estimateGas);

  return {
    ...txn,
    gasLimit,
  };
};

export const getAddPositionTransactionData = async (
  tokenA: PoolToken,
  tokenB: PoolToken,
  leftRange: string,
  rightRange: string,
  feeAmount: typeof POOL_SUPPORTED_FEES[number],
  position?: Position,
) => {
  // eslint-disable-next-line no-nested-ternary
  const independentField = +tokenA.value > 0
    ? FieldTypes.CurrencyA
    : +tokenB.value > 0 ? FieldTypes.CurrencyB : FieldTypes.CurrencyA;

  const {
    uniswapPool,
    uniswapPosition,
    outOfRange,
    noLiquidity,
  } = await useV3DerivedMintInfo(
    tokenA,
    tokenB,
    leftRange,
    rightRange,
    feeAmount,
    position?.positionData,
    position && independentField,
  );

  if (!uniswapPool) {
    // eslint-disable-next-line no-console
    console.warn('[App warn]: do not create uniswapPool in useV3DerivedMintInfo');
    return void 0;
  }

  if (!uniswapPosition) {
    // eslint-disable-next-line no-console
    console.warn('[App warn]: do not create position in useV3DerivedMintInfo');
    return void 0;
  }

  return getTransactionData(
    uniswapPool,
    uniswapPosition,
    position?.tokenId,
    outOfRange,
    noLiquidity,
  );
};
