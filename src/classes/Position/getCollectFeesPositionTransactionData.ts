import { useCore } from '@/store';
import {
  NonfungiblePositionManager as UniswapNonfungiblePositionManager,
  CollectOptions,
} from '@uniswap/v3-sdk';
import { calculateGasMargin } from './calculateGasMargin';
import { useDerivedV3UnclaimedFeesInfo } from './useDerivedV3UnclaimedFeesInfo';
import { Position } from './Position';

export const getTransactionData = async (
  tokenId: string,
  feeValue0: CollectOptions['expectedCurrencyOwed0'],
  feeValue1: CollectOptions['expectedCurrencyOwed1'],
) => {
  const { account, appEnv } = useCore();
  if (!account.value || !appEnv.value) return void 0;

  const { ethAccount } = account.value;
  const { NONFUNGIBLE_POSITION_MANAGER_ADDRESS } = appEnv.value;

  const { calldata, value } = UniswapNonfungiblePositionManager.collectCallParameters({
    tokenId,
    expectedCurrencyOwed0: feeValue0,
    expectedCurrencyOwed1: feeValue1,
    recipient: ethAccount,
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

export const getCollectFeesPositionTransactionData = (
  position: Position,
  asWETH: boolean,
) => {
  const {
    feeValue0,
    feeValue1,
  } = useDerivedV3UnclaimedFeesInfo(position, asWETH);

  return getTransactionData(
    position.tokenId,
    feeValue0,
    feeValue1,
  );
};
