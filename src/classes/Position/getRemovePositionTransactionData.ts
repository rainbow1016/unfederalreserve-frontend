import {
  NonfungiblePositionManager as UniswapNonfungiblePositionManager,
  RemoveLiquidityOptions,
} from '@uniswap/v3-sdk';

import { useCore } from '@/store';
import { Position } from './Position';
import { calculateGasMargin } from './calculateGasMargin';
import { getTransactionDeadline } from './getTransactionDeadline';
import { useDerivedV3BurnInfo } from './useDerivedV3BurnInfo';
import {
  getUserSlippageToleranceWithDefault,
  DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE,
} from './getUserSlippageToleranceWithDefault';


const getTransactionData = async (
  tokenId: string,
  positionSDK: Parameters<typeof UniswapNonfungiblePositionManager.removeCallParameters>[0],
  liquidityPercentage: RemoveLiquidityOptions['liquidityPercentage'],
  feeValue0: RemoveLiquidityOptions['collectOptions']['expectedCurrencyOwed0'],
  feeValue1: RemoveLiquidityOptions['collectOptions']['expectedCurrencyOwed1'],
) => {
  const { account, appEnv } = useCore();
  if (!account.value || !appEnv.value) return void 0;

  const { ethAccount } = account.value;
  const { NONFUNGIBLE_POSITION_MANAGER_ADDRESS } = appEnv.value;

  // custom from users settings
  const deadline = await getTransactionDeadline();

  // custom from users
  const allowedSlippage = getUserSlippageToleranceWithDefault(
    DEFAULT_REMOVE_V3_LIQUIDITY_SLIPPAGE_TOLERANCE,
  );

  const { calldata, value } = UniswapNonfungiblePositionManager.removeCallParameters(positionSDK, {
    tokenId,
    liquidityPercentage,
    slippageTolerance: allowedSlippage,
    deadline: deadline.toString(),
    collectOptions: {
      expectedCurrencyOwed0: feeValue0,
      expectedCurrencyOwed1: feeValue1,
      recipient: ethAccount,
    },
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

export const getRemovePositionTransactionData = (
  position: Position,
  percent: number,
  asWETH: boolean,
) => {
  const {
    position: positionSDK,
    liquidityPercentage,
    feeValue0,
    feeValue1,
  } = useDerivedV3BurnInfo(position, percent, asWETH);

  return getTransactionData(
    position.tokenId,
    positionSDK,
    liquidityPercentage,
    feeValue0,
    feeValue1,
  );
};
