/* eslint-disable no-underscore-dangle */

import { markRaw, shallowReactive, isProxy } from 'vue';
import { ContractTransaction, providers, utils } from 'ethers';
// eslint-disable-next-line object-curly-newline
import { memoizeAsync, retry, AfterParams, after } from 'utils-decorators';

import { GetAccountLiquidityResponse } from '@/types/generated/GComptroller';
import { CompbalanceResponse } from '@/types/generated/GCompoundLens';
import { Wallet, IPositionData } from '@/types/common.d';

import { getProfits } from '@/services/api';
import { IEnv } from '@/global/env';
import { HIDDEN_TOKEN_MAP } from '@/helpers/enums/tokens';
import { formatUnits } from '@/helpers/formatUnits';
import { shortenToken } from '@/helpers/shortenToken';

import { sortMarkets } from '@/helpers/sortMarkets';
import { Market } from '@/classes/Market';
import { Position } from '@/classes/Position/Position';

import { Comptroller } from './Comptroller';
import { CompoundLens } from './CompoundLens';
import { LPToken } from './LPToken';


export class Account {
  public liquidity!: GetAccountLiquidityResponse;

  private comp_balance: CompbalanceResponse | null = null;

  public lpBalance = '';

  public eRSDL!: Market;

  private isDestroyed = false;

  private constructor(
    public readonly ethAccount: string,
    public readonly env: IEnv,
    public readonly web3Provider: providers.Web3Provider,
    public readonly compoundLens: CompoundLens,
    public readonly comptroller: Comptroller,
    public readonly lpToken: LPToken,
    public readonly wallet: Wallet,
    public markets: Market[] = [],
    public positions: Position[] = [],
  ) {
    // do not set subscribes because missing reactivity,
    // use for that initialize method

    // eslint-disable-next-line no-console
    console.log('Account#initialize', this.env._CHAIN_ID, shortenToken(this.ethAccount));
  }

  public static buildClass(
    web3Provider: providers.Web3Provider,
    ethAccount: string,
    env: IEnv,
    wallet: Wallet,
  ) {
    const compoundLens = new CompoundLens(
      env.COMPOUND_LENS_ADDRESS,
      web3Provider,
    );

    const comptroller = new Comptroller(
      env.COMPTROLLER_ADDRESS,
      web3Provider,
    );

    const lpToken = new LPToken(
      env.V2_LP_TOKENS_ADDRESS,
      env,
    );

    const account = new Account(
      ethAccount,
      markRaw(env),
      markRaw(web3Provider),
      markRaw(compoundLens),
      markRaw(comptroller),
      markRaw(lpToken),
      wallet,
    );

    return shallowReactive(account);
  }

  @memoizeAsync(1000)
  public async updateMarkets() {
    // eslint-disable-next-line object-curly-newline
    const { comptroller, compoundLens, ethAccount, env } = this;

    const marketAddressList = await comptroller.methods.getAllMarkets();

    const promises0 = marketAddressList
      .filter((address) => !HIDDEN_TOKEN_MAP[address.toLowerCase()])
      .map((address) => {
        const market = this.markets.find((_) => _.address === address);
        if (market) return market;
        return Market.buildClass(address, this).then((_) => _.initialize());
      });

    const promises1 = [
      compoundLens.methods.cTokenBalancesAll(marketAddressList, ethAccount),
      compoundLens.methods.cTokenMetadataAll(marketAddressList),
      compoundLens.methods.cTokenUnderlyingPriceAll(marketAddressList),

      getProfits(env, ethAccount),
      Promise.all(promises0),
    ] as const;

    const [
      balancesAll,
      tokenMetadataAll,
      underlyingPriceAll,

      earnedAll,
      markets,
    ] = await Promise.all(promises1);

    const index = markets.findIndex((_) => _.symbol === 'eRSDL');
    const eRSDL = markets[index];

    // move eRSDL to first and update them all
    const promises2 = markets.slice().splice(index, 1).concat(markets).map((market) => {
      const balances = balancesAll.find((data) => data[0] === market.address);
      const tokenMetadata = tokenMetadataAll.find((data) => data[0] === market.address);
      const underlyingPrice = underlyingPriceAll.find((data) => data[0] === market.address);
      const earned = {
        underlying: earnedAll.underlying[market.address] || '0',
        usd: earnedAll.usd[market.address] || 0,
      };

      return market.update(
        eRSDL,
        balances,
        tokenMetadata,
        underlyingPrice?.underlyingPrice,
        earned,
      );
    });

    await Promise.all(promises2);

    this.markets = markets.sort(sortMarkets);
    this.eRSDL = eRSDL;
  }

  @memoizeAsync(1000)
  public async updateCompBalance() {
    if (!this.eRSDL) return;
    const comp_balance = await this.compoundLens.methods.getCompBalance(
      this.eRSDL.underlying.methods.address,
      this.env.COMPTROLLER_ADDRESS,
      this.ethAccount,
    );

    this.comp_balance = comp_balance;
  }

  @memoizeAsync(60_000)
  public async updateLPTokens() {
    const balance = await this.lpToken.balanceOf(this.ethAccount);
    this.lpBalance = formatUnits(balance);
  }

  @memoizeAsync(1000)
  public async updateLiquidity() {
    const { ethAccount, comptroller } = this;
    const liquidity = await comptroller.methods.getAccountLiquidity(ethAccount);
    this.liquidity = liquidity;
  }

  @memoizeAsync(1000)
  @retry({
    delaysArray: [1000, 5000, 16000],
    delay: 1500,
    // eslint-disable-next-line no-console
    onRetry: (e, retriesCount) => console.log(e, retriesCount, 'Account#updateAllPositions'),
  })
  public updateAllPositions() {
    if (this.isDestroyed) return Promise.resolve(this);
    return this.updateAllPositionsOnce();
  }

  public async updateAllPositionsOnce() {
    const label = `Account#updateAllPositions ${shortenToken(this.ethAccount)}`;

    // eslint-disable-next-line no-console
    console.time(label);

    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Account#updatePositions is not in reactivity');
      }
    }

    const positions = await Position.getPositions(this);
    const promises = positions.map((position) => position.update());
    await Promise.all(promises);
    this.positions = positions;

    // eslint-disable-next-line no-console
    console.timeEnd(label);

    return this;
  }

  @memoizeAsync(1000)
  @retry({
    delaysArray: [1000, 5000, 16000],
    delay: 1500,
    // eslint-disable-next-line no-console
    onRetry: (e, retriesCount) => console.log(e, retriesCount, 'Account#updateAllMarkets'),
  })
  public async updateAllMarkets() {
    if (this.isDestroyed) return Promise.resolve(this);
    return this.updateAllMarketsOnce();
  }

  public async updateAllMarketsOnce() {
    const label = `Account#updateAllMarkets ${shortenToken(this.ethAccount)}`;

    // eslint-disable-next-line no-console
    console.time(label);

    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Account#update is not in reactivity');
      }
    }

    const promises0 = [
      this.updateMarkets(),
      this.updateLiquidity(),
    ];

    await Promise.all(promises0);

    // eslint-disable-next-line no-console
    console.timeEnd(label);

    // after update markets
    const promises1 = [
      this.updateCompBalance(),
    ];

    void Promise.all(promises1);

    const promises2 = [
      this.updateLPTokens(),
    ];

    void Promise.all(promises2);

    return this;
  }

  public subscribe(event: string, callback: (args?: unknown) => void) {
    /*
    this.eRSDL.subscribe('Transfer', () => {
      void this.updateCompBalance();
    });
    */

    this.markets.forEach((market) => {
      market.subscribe(event, callback);
    });
  }

  public destroy() {
    // eslint-disable-next-line no-console
    console.log('Account#destroy', this.env._CHAIN_ID, shortenToken(this.ethAccount));

    this.markets.forEach((market) => {
      market.destroy();
    });

    this.markets = [];
    this.isDestroyed = true;
  }

  public watchTx(options: ContractTransaction | AfterParams<ContractTransaction>) {
    const tx = 'response' in options ? options.response : options;

    type IArgs =
      | void
      | Parameters<this['sendTransaction']>
      | Parameters<this['claimRewards']>;

    const args = ('args' in options ? options.args : void 0) as IArgs;
    void this.wallet.watchTx(tx, args?.[1]);
  }

  @after<Account>({ func: 'watchTx', wait: true })
  public claimRewards() {
    const cTokens = this.markets
      .filter((market) => market.isTokensGeneratingRewards)
      .map((market) => market.address);

    return this.comptroller.claimRewards(cTokens);
  }

  @after<Account>({ func: 'watchTx', wait: true })
  public sendTransaction(
    transaction: providers.TransactionRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: { position?: IPositionData } = {},
  ) {
    return this.web3Provider.getSigner().sendTransaction(transaction);
  }

  public get supply_markets() {
    return this.markets
      .filter((market) => market.isSupply);
  }

  public get user_supplied_markets() {
    return this.markets
      .filter((market) => market.isUserSupplied);
  }

  public get borrow_markets() {
    return this.markets
      .filter((market) => market.isBorrow);
  }

  public get user_borrowed_markets() {
    return this.markets
      .filter((market) => market.isUserBorrowed);
  }

  public get total_supply() {
    return this.markets
      .reduce((acc, market) => (
        acc + market.fiat_supply
      ), 0);
  }

  public get total_borrow() {
    return this.markets
      .reduce((acc, market) => (
        acc + market.fiat_borrow
      ), 0);
  }

  public get total_earning() {
    return this.markets
      .reduce((acc, market) => (
        market._balances.balanceOfUnderlying.eq(0)
          ? acc
          : acc + (market.fiat_supply * market.supply_apy) / 100
      ), 0);
  }

  public get total_spending() {
    return this.markets
      .reduce((acc, market) => (
        market._balances.borrowBalanceCurrent.eq(0)
          ? acc
          : acc + (market.fiat_borrow * market.borrow_apy) / 100
      ), 0);
  }

  public get net_apy() {
    const { total_supply } = this;
    const value = total_supply === 0
      ? 0
      : ((this.total_earning - this.total_spending) * 100) / total_supply;

    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  public get borrow_limit() {
    const liquidity = this.liquidity?.[1].toString();
    if (!liquidity) return 0;
    return +utils.formatEther(liquidity) + this.total_borrow;
  }

  public get borrow_limit_used() {
    const { borrow_limit, total_borrow } = this;
    if (!borrow_limit) return 0;

    return (total_borrow / borrow_limit) * 100;
  }

  public get unclaimed_rewards() {
    if (!this.comp_balance) return 0;
    const { allocated } = this.comp_balance;
    return formatUnits(allocated);
  }

  public get ersdl_balance() {
    if (!this.comp_balance) return 0;
    const { balance } = this.comp_balance;
    return formatUnits(balance);
  }

  public get balance() {
    if (!this.comp_balance) return 0;
    const { allocated, balance } = this.comp_balance;
    const value = allocated.add(balance);
    return formatUnits(value);
  }

  public get isEnteredTheMarket() {
    return this.user_supplied_markets
      .find((market) => (
        market.isEnteredTheMarket
      ));
  }
}
