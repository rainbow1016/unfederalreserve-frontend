import { useRouter } from 'vue-router';
// eslint-disable-next-line object-curly-newline
import { Account, Market, Position, PoolToken } from '@/types/common.d';
import { formatSymbol } from '@/helpers/formatters/legacy';
import { ROUTE_POOL } from '@/helpers/enums/routes';

import {
  useModalTransactionMessageConfirm,
  useModalTransactionSubmitted,
} from '@/components/modals';

import {
  ITransactionGeneratorError,
  transactionNotifySuccess as notifyTransactionSuccess,
  transactionNotifyError as notifyTransactionError,
} from './transaction-notify';
import { TransactionActionTypes, TransactionTypes } from './utils-common';


type ITransactionGeneratorResult = {
  type: TransactionActionTypes;
  txHash?: string;
  error?: ITransactionGeneratorError;
};

type ITransactionGenerator = AsyncGenerator<ITransactionGeneratorResult, boolean, unknown>

type ITransactionExecutorGeneratorParams =
  | {
    generator: ITransactionGenerator;
    type?: TransactionTypes;
    market: Market;
    value?: string;
    account?: never;
  }
  | {
    generator: ITransactionGenerator;
    type?: never;
    market?: never;
    value?: string;
    account: Account;
  };


const createWalletConfirmedReducer = (
  withWaitModalSubmitted = false,
  timeout = 0,
) => {
  const modalConfirm = useModalTransactionMessageConfirm();
  const modalSubmitted = useModalTransactionSubmitted();

  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    account?: Account,
    market?: Market,
    addToMetaMask = false,
    addToMetaMaskWETH = false,
  ) => {
    const { txHash, error } = generatorValue;

    switch (generatorValue.type) {
      case TransactionActionTypes.wallet_confirm_request: {
        void modalConfirm.show({});
        break;
      }

      case TransactionActionTypes.wallet_confirmed: {
        void modalConfirm.hide();
        // eslint-disable-next-line object-curly-newline
        const propData = { txHash, addToMetaMask, account, market, timeout, addToMetaMaskWETH };
        const result = modalSubmitted.show(propData).then(() => true);
        if (withWaitModalSubmitted) return result;
        break;
      }

      case TransactionActionTypes.wallet_confirm_deny: {
        void modalConfirm.hide();
        const propData = { error, account, market };
        notifyTransactionError(propData);
        break;
      }

      default:
    }

    return false;
  };

  return reducer;
};

const createApproveReducer = () => {
  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    market?: Market,
    poolToken?: PoolToken,
  ) => {
    let isSuccess = false;
    const { txHash, error } = generatorValue;
    const symbol = formatSymbol(poolToken?.symbol || market?.symbol || '');

    switch (generatorValue.type) {
      case TransactionActionTypes.approve_confirmed: {
        const text = `${symbol} enabled to transact`;
        const propData = { txHash, market, text };
        notifyTransactionSuccess(propData);
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.approve_failed: {
        const text = `Failed ${symbol} enabling to transact`;
        notifyTransactionError({ error, market, text });
        break;
      }

      default:
    }

    return isSuccess;
  };

  return reducer;
};

const createCommonReducer = () => {
  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    account?: Account,
    market?: Market,
    amount = '',
  ) => {
    const { txHash, error } = generatorValue;
    const symbol = formatSymbol(market?.symbol || '');
    const cSymbol = formatSymbol(market?.cSymbol || '');

    let isSuccess = false;

    switch (generatorValue.type) {
      case TransactionActionTypes.mint_confirmed: {
        const text = `Submitted supply ${amount} ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.mint_failed: {
        const text = `Failed supply ${amount} ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.redeem_confirmed: {
        const text = `Submitted withdraw ${amount} ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.redeem_failed: {
        const text = `Failed withdraw ${amount} ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.borrow_confirmed: {
        const text = `Submitted borrow ${amount} ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.borrow_failed: {
        const text = `Failed borrow ${amount} ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.repay_borrow_confirmed: {
        const text = `Submitted repay borrow ${amount} ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.repay_borrow_failed: {
        const text = `Failed repay borrow ${amount} ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.allocate_to_confirmed_ether: {
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.allocate_to_confirmed: {
        const text = `Submitted allocate to ${amount} ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.allocate_to_failed: {
        const text = `Failed allocate to ${amount} ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.exit_market_confirmed: {
        const text = `Submitted exit from market ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.exit_market_failed: {
        const text = `Failed exit from market ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.enter_market_confirmed: {
        const text = `Submitted enter to market ${symbol} token`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.enter_market_failed: {
        const text = `Failed exit from market ${symbol} token`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.add_cToken_to_metamask_confirmed: {
        const text = `Added ${cSymbol} cToken to MetaMask`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.add_token_to_metamask_confirmed: {
        const text = `Added ${symbol} token to MetaMask`;
        notifyTransactionSuccess({ txHash, market, text });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.add_token_to_metamask_failed: {
        const text = `Failed added ${cSymbol} cToken to MetaMask`;
        notifyTransactionError({ error, market, text });
        break;
      }

      case TransactionActionTypes.claim_rewards_confirmed: {
        const text = 'Claimed rewards confirmed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionSuccess({ txHash, market, text, account });
        isSuccess = true;
        break;
      }

      case TransactionActionTypes.claim_rewards_failed: {
        const text = 'Claimed rewards failed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionError({ error, market, text, account });
        break;
      }

      case TransactionActionTypes.add_uniswap_position_confirmed: {
        const text = 'Add liquidity to uniswap confirmed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionSuccess({ market, text, account });
        break;
      }

      case TransactionActionTypes.add_uniswap_position_failed: {
        const text = 'Add liquidity to uniswap failed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionError({ error, market, text, account });
        break;
      }

      case TransactionActionTypes.collect_fees_position_confirmed: {
        const text = 'Collect fees confirmed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionSuccess({ market, text, account });
        break;
      }

      case TransactionActionTypes.collect_fees_position_failed: {
        const text = 'Collect fees failed';
        // eslint-disable-next-line object-curly-newline
        notifyTransactionError({ error, market, text, account });
        break;
      }

      default:
    }

    return isSuccess;
  };

  return reducer;
};

const createAddUniswapPositionReducer = () => {
  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    tokenA: PoolToken,
    tokenB: PoolToken,
    account?: Account,
    position?: Position,
  ) => {
    const { error } = generatorValue;

    switch (generatorValue.type) {
      case TransactionActionTypes.add_uniswap_position_confirmed: {
        const text = position
          ? `Add ${tokenA.symbol}/${tokenB.symbol} liquidity confirmed`
          : `${tokenA.symbol}/${tokenB.symbol} pool creating confirmed`;

        notifyTransactionSuccess({ text, account });
        return true;
      }

      case TransactionActionTypes.add_uniswap_position_failed: {
        const text = position
          ? `Add ${tokenA.symbol}/${tokenB.symbol} liquidity failed`
          : `${tokenA.symbol}/${tokenB.symbol} pool creating failed`;
        notifyTransactionError({ error, text, account });
        break;
      }

      default:
    }

    return false;
  };

  return reducer;
};

const createRemoveLiquidityUniswapPositionReducer = () => {
  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    marketA: Market,
    marketB: Market,
    account?: Account,
    asWETH = false,
  ) => {
    const { error } = generatorValue;

    let symbols = `${marketA?.symbol}/${marketB?.symbol}`;
    if (asWETH) symbols = symbols.replace('ETH', 'WETH');

    switch (generatorValue.type) {
      case TransactionActionTypes.remove_liquidity_from_uniswap_position_confirmed: {
        const text = `${symbols} remove liquidity confirmed`;
        notifyTransactionSuccess({ text, account });
        return true;
      }

      case TransactionActionTypes.remove_liquidity_from_uniswap_position_failed: {
        const text = `${symbols} remove liquidity failed`;
        notifyTransactionError({ error, text, account });
        break;
      }

      default:
    }

    return false;
  };

  return reducer;
};

const createCollectFeesPositionReducer = () => {
  const reducer = (
    generatorValue: ITransactionGeneratorResult,
    marketA?: Market,
    marketB?: Market,
    account?: Account,
    asWETH = false,
  ) => {
    const { error } = generatorValue;

    let symbols = `${marketA?.symbol || 'UNKNOWN'}/${marketB?.symbol || 'UNKNOWN'}`;
    if (asWETH) symbols = symbols.replace('ETH', 'WETH');

    switch (generatorValue.type) {
      case TransactionActionTypes.collect_fees_position_confirmed: {
        const text = `Collect ${symbols} fees confirmed`;
        notifyTransactionSuccess({ text, account });
        return true;
      }

      case TransactionActionTypes.collect_fees_position_failed: {
        const text = `Collect ${symbols} fees failed`;
        notifyTransactionError({ error, text, account });
        break;
      }

      default:
    }

    return false;
  };

  return reducer;
};

export const createTransactionExecutorGenerator = () => {
  const walletConfirmedReducer = createWalletConfirmedReducer();
  const approveReducer = createApproveReducer();
  const commonReducer = createCommonReducer();

  return async ({
    generator,
    type,
    market,
    account,
    value = '',
  }: ITransactionExecutorGeneratorParams): Promise<boolean> => {
    let isSuccess = false;

    const addToMetaMask = type ? [
      TransactionTypes.supply,
    ].includes(type) : false;

    // eslint-disable-next-line no-restricted-syntax
    for await (const generatorValue of generator) {
      let result: boolean;

      void walletConfirmedReducer(generatorValue, account, market, addToMetaMask);

      result = approveReducer(generatorValue, market);
      if (result) isSuccess = result;

      result = commonReducer(generatorValue, account, market, value);
      if (result) isSuccess = result;
    }

    void market?.account.updateAllMarkets();
    void account?.updateAllMarkets();

    return isSuccess;
  };
};


const REDIRECT_DATA_TIMEOUT = 60_000;

export const createAddUniswapPositionExecutorGenerator = () => {
  const router = useRouter();
  const walletConfirmedReducer = createWalletConfirmedReducer(true, REDIRECT_DATA_TIMEOUT);
  const addUniswapPositionReducer = createAddUniswapPositionReducer();

  type IParams = ITransactionExecutorGeneratorParams & {
    tokenA: PoolToken;
    tokenB: PoolToken;
    position?: Position;
  };

  return async ({
    generator,
    account,
    tokenA,
    tokenB,
    position,
  }: IParams): Promise<boolean> => {
    let isSuccess: boolean | Promise<boolean> = false;
    let isNeededRedirect = !position;

    const unwatch = router.afterEach(() => {
      isNeededRedirect = false;
      unwatch();
    });

    const tryRedirectToPool = () => {
      if (!isNeededRedirect) return null;
      return router.push({ name: ROUTE_POOL });
    };

    // eslint-disable-next-line no-restricted-syntax
    for await (const generatorValue of generator) {
      let result: boolean | Promise<boolean>;

      result = walletConfirmedReducer(generatorValue, account);

      // force stop for redirect to pool list page
      if (result) void result.then(tryRedirectToPool);

      result = addUniswapPositionReducer(generatorValue, tokenA, tokenB, account, position);
      if (result) isSuccess = result;
    }

    isNeededRedirect = isNeededRedirect && isSuccess;

    const promises = [
      position?.update(),
      account?.updateAllPositions(),
      tokenA.update(),
      tokenB.update(),
    ] as const;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await Promise.all(promises).catch(() => {});

    // if transaction complete -> then redirect
    void tryRedirectToPool();

    return isSuccess;
  };
};

export const createApproveUniswapPositionExecutorGenerator = () => {
  const walletConfirmedReducer = createWalletConfirmedReducer();
  const approveReducer = createApproveReducer();

  type IParams = {
    token: PoolToken;
    generator: ITransactionGenerator;
  };

  return async (params: IParams): Promise<boolean> => {
    let isSuccess = false;
    const { generator, token } = params;

    // eslint-disable-next-line no-restricted-syntax
    for await (const generatorValue of generator) {
      void walletConfirmedReducer(generatorValue, void 0, token.market);

      const result = approveReducer(generatorValue, token.market, token);
      if (result) isSuccess = result;
    }

    void token?.update();

    return isSuccess;
  };
};

export const createRemoveLiquidityUniswapPositionExecutorGenerator = () => {
  const walletConfirmedReducer = createWalletConfirmedReducer(true, REDIRECT_DATA_TIMEOUT);
  const removeLiquidityUniswapPositionReducer = createRemoveLiquidityUniswapPositionReducer();

  type IReturn = ITransactionExecutorGeneratorParams & {
    marketA: Market;
    marketB: Market;
    asWETH: boolean;
  };

  return async ({
    generator,
    account,
    marketA,
    marketB,
    asWETH,
  }: IReturn): Promise<boolean> => {
    let isSuccess = false;

    const marketETH = marketA?.isEther ? marketA : marketB;

    // eslint-disable-next-line no-restricted-syntax
    for await (const generatorValue of generator) {
      void walletConfirmedReducer(generatorValue, account, marketETH, asWETH, asWETH);

      const result = removeLiquidityUniswapPositionReducer(generatorValue, marketA, marketB, account, asWETH);
      if (result) isSuccess = result;
    }

    void account?.updateAllMarkets();

    return isSuccess;
  };
};

export const createCollectFeesPositionExecutorGenerator = () => {
  // TODO: try to pass false
  const walletConfirmedReducer = createWalletConfirmedReducer(true);
  const collectFeesPositionReducer = createCollectFeesPositionReducer();

  type IReturn = ITransactionExecutorGeneratorParams & {
    marketA?: Market;
    marketB?: Market;
    asWETH: boolean;
  };

  return async ({
    generator,
    account,
    marketA,
    marketB,
    asWETH,
  }: IReturn): Promise<boolean> => {
    let isSuccess: boolean | Promise<boolean> = false;

    const marketETH = marketA?.isEther ? marketA : marketB;

    // eslint-disable-next-line no-restricted-syntax
    for await (const generatorValue of generator) {
      let result: boolean | Promise<boolean>;

      result = walletConfirmedReducer(generatorValue, account, marketETH, asWETH, asWETH);

      result = collectFeesPositionReducer(generatorValue, marketA, marketB, account, asWETH);
      if (result) isSuccess = result;
    }

    void account?.updateAllMarkets();

    return isSuccess;
  };
};
