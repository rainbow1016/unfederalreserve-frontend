import { MetaMaskInpageProvider } from '@metamask/providers';
import { BigNumber, ContractTransaction, providers } from 'ethers';

// eslint-disable-next-line object-curly-newline
import { Account, Market, PoolToken, IPositionData } from '@/types/common.d';
import { TransactionActionTypes } from './utils-common';


type ITransactionGenerator = AsyncGenerator<
{
  type: TransactionActionTypes;
  txHash?: string | undefined;
  error?: unknown;
},
  boolean,
  unknown
>;

export async function* TransactionGeneratorCommon(
  callback: () => Promise<true | ContractTransaction>,
  type_completed: TransactionActionTypes,
  type_fail: TransactionActionTypes,
): ITransactionGenerator {
  let tx: ContractTransaction;

  // step 1
  yield {
    type: TransactionActionTypes.wallet_confirm_request,
  };

  // step 2
  try {
    const result = await callback();

    if (result === true) {
      yield {
        type: type_completed,
      };

      return true;
    }

    tx = result;

    yield {
      type: TransactionActionTypes.wallet_confirmed,
      txHash: tx.hash,
    };
  } catch (error: unknown) {
    yield {
      type: TransactionActionTypes.wallet_confirm_deny,
      error,
    };

    return false;
  }

  // step 3
  try {
    await tx.wait();
    yield {
      type: type_completed,
      txHash: tx.hash,
    };

    return true;
  } catch (error: unknown) {
    yield {
      type: type_fail,
      txHash: tx.hash,
      error,
    };

    return false;
  }
}

export async function* TransactionGeneratorAllocateToCommon(
  callback: () => Promise<void>,
  type_completed: TransactionActionTypes,
): ITransactionGenerator {
  await callback();
  yield {
    type: type_completed,
    txHash: ' ',
  };
  return true;
}


const getFaucetToken = async (market: Market) => {
  const { FaucetToken } = await import('@/classes/FaucetToken');
  const { web3Provider } = market.account;

  const faucetToken = new FaucetToken(
    market.underlying.methods.address,
    web3Provider,
    true,
    market.account.ethAccount,
  );

  return faucetToken;
};


//


function TransactionGeneratorApprove(
  market: Market | PoolToken,
  address: string,
) {
  const callback = () => market.approve(address);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.approve_confirmed,
    TransactionActionTypes.approve_failed,
  );

  return generator;
}

export function TransactionGeneratorApproveForMarket(
  market: Market,
) {
  // eslint-disable-next-line no-underscore-dangle
  const address = market._tokenMetadata.cToken;
  return TransactionGeneratorApprove(market, address);
}

export function TransactionGeneratorApproveForUniswapPool(
  poolToken: PoolToken,
) {
  // eslint-disable-next-line no-underscore-dangle
  const address = poolToken.account.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS;
  return TransactionGeneratorApprove(poolToken, address);
}

export function TransactionGeneratorMint(
  market: Market,
  mintAmount: BigNumber,
) {
  const callback = () => market.mint(mintAmount);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.mint_confirmed,
    TransactionActionTypes.mint_failed,
  );

  return generator;
}

export function TransactionGeneratorRedeem(
  market: Market,
  redeemAmount: BigNumber,
) {
  const callback = () => market.redeem(redeemAmount);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.redeem_confirmed,
    TransactionActionTypes.redeem_failed,
  );

  return generator;
}

export function TransactionGeneratorBorrow(
  market: Market,
  borrowAmount: BigNumber,
) {
  const callback = () => market.borrow(borrowAmount);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.borrow_confirmed,
    TransactionActionTypes.borrow_failed,
  );

  return generator;
}

export function TransactionGeneratorRepayBorrow(
  market: Market,
  repayAmount: BigNumber,
) {
  const callback = () => market.repayBorrow(repayAmount);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.repay_borrow_confirmed,
    TransactionActionTypes.repay_borrow_failed,
  );

  return generator;
}

export function TransactionGeneratorAllocateTo(
  market: Market,
  faucetAmount: BigNumber,
) {
  if (market.isEther) {
    const callback = async () => {
      const faucetToken = await getFaucetToken(market);
      return faucetToken.allocateEth();
    };

    const generator = TransactionGeneratorAllocateToCommon(
      callback,
      TransactionActionTypes.allocate_to_confirmed_ether,
    );

    return generator;
  }

  const callback = async () => {
    const faucetToken = await getFaucetToken(market);
    return faucetToken.allocateTo(faucetAmount);
  };

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.allocate_to_confirmed,
    TransactionActionTypes.allocate_to_failed,
  );

  return generator;
}

export function TransactionGeneratorExitFromMarket(
  market: Market,
) {
  const callback = () => market.exitFromMarket();

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.exit_market_confirmed,
    TransactionActionTypes.exit_market_failed,
  );

  return generator;
}

export function TransactionGeneratorEnterToMarket(
  market: Market,
) {
  const callback = () => market.enterToMarket();

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.enter_market_confirmed,
    TransactionActionTypes.enter_market_failed,
  );

  return generator;
}

export function TransactionGeneratorClaimRewards(
  account: Account,
) {
  const callback = () => account.claimRewards();

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.claim_rewards_confirmed,
    TransactionActionTypes.claim_rewards_failed,
  );

  return generator;
}

export async function* TransactionGeneratorAddToMetaMask(
  options: {
    symbol: string;
    address: string;
    decimals: number;
    image?: string;
  },
  isUnderlying: boolean,
): ITransactionGenerator {
  try {
    const ethereum = window.ethereum as MetaMaskInpageProvider;

    const result = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: { ...options },
      },
    }) as boolean;

    const successActionType = isUnderlying
      ? TransactionActionTypes.add_token_to_metamask_confirmed
      : TransactionActionTypes.add_cToken_to_metamask_confirmed;

    yield {
      type: result
        ? successActionType
        : TransactionActionTypes.add_token_to_metamask_failed,
      txHash: void 0,
    };

    return result;
  } catch (error: unknown) {
    yield {
      type: TransactionActionTypes.add_token_to_metamask_failed,
      error,
      txHash: void 0,
    };
    return false;
  }
}

export function TransactionGeneratorAddPosition(
  account: Account,
  transaction: providers.TransactionRequest,
  positionData: IPositionData,
) {
  const params = { position: positionData };
  const callback = () => account.sendTransaction(transaction, params);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.add_uniswap_position_confirmed,
    TransactionActionTypes.add_uniswap_position_failed,
  );

  return generator;
}

export function TransactionGeneratorRemoveLiquidityPosition(
  account: Account,
  transaction: providers.TransactionRequest,
) {
  const callback = () => account.sendTransaction(transaction);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.remove_liquidity_from_uniswap_position_confirmed,
    TransactionActionTypes.remove_liquidity_from_uniswap_position_failed,
  );

  return generator;
}

export function TransactionGeneratorCollectFeesPosition(
  account: Account,
  transaction: providers.TransactionRequest,
) {
  const callback = () => account.sendTransaction(transaction);

  const generator = TransactionGeneratorCommon(
    callback,
    TransactionActionTypes.collect_fees_position_confirmed,
    TransactionActionTypes.collect_fees_position_failed,
  );

  return generator;
}
