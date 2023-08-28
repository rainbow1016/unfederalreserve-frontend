/* eslint-disable no-underscore-dangle */

import { BigNumber, ContractTransaction } from 'ethers';
import { markRaw, shallowReactive, isProxy } from 'vue';
import { AfterParams, after } from 'utils-decorators';

import { CtokenbalancesResponse, CtokenmetadataResponse } from '@/types/generated/GCompoundLens';
import { Account } from '@/types/common.d';

import { CToken } from '@/classes/CToken';
import { Token } from '@/classes/Token';
import { CEther } from '@/classes/CEther';
import { CErc20 } from '@/classes/CErc20';

import { calculateAPY } from '@/helpers/calculateAPY';
import { convertToUsd } from '@/helpers/formatters';
import { formatUnits } from '@/helpers/formatUnits';
import { toFixed } from '@/helpers/toFixed';
import { LEGACY_eRSDL_TOKEN_MAP } from '@/helpers/enums/tokens';


export class Market {
  private eRSDL!: Market;

  public _totalBorrows!: BigNumber;

  public _totalSupply!: BigNumber;

  public _balances!: CtokenbalancesResponse;

  public _tokenMetadata!: CtokenmetadataResponse;

  public _underlyingPrice!: BigNumber;

  public _exchangeRateStored!: BigNumber;

  public _liquidity!: BigNumber;

  public _compSpeeds!: BigNumber;

  public earned = {
    usd: 0,
    underlying: '0',
  };

  public supply_allowed!: boolean;

  public borrow_allowed!: boolean;

  public supply_apy!: number;

  public borrow_apy!: number;

  public isEnteredTheMarket!: boolean;

  public loading = false;

  public subscribes: { event: string; callback: () => void }[] = [];

  private constructor(
    public readonly account: Account,
    public readonly cErc20: CToken,
    public readonly underlying: CToken | Token,
    public readonly isEther: boolean,
    public readonly symbol: string,
    public readonly cSymbol: string,
    public readonly name: string,
    public readonly address: string,
  ) {
    // do not set subscribes because missing reactivity,
    // use for that initialize method
  }

  public static async buildClass(
    address: string,
    account: Account,
  ) {
    const { web3Provider } = account;

    const cEther = new CEther(address, web3Provider);
    const isEther = await cEther.isEther();
    const cToken = new CToken(address, web3Provider, isEther);
    const cSymbol = await cToken.methods.symbol();
    let underlying: CToken | Token;

    if (isEther) {
      underlying = cToken;
    } else {
      const addressAlt = await (cToken as CErc20).methods.underlying();
      underlying = new Token(addressAlt, web3Provider);
    }

    let [symbol, name] = isEther
      ? ['ETH', 'ETH']
      : await Promise.all([
        underlying.methods.symbol(),
        underlying.methods.name(),
      ]);

    const tokenLegacy = LEGACY_eRSDL_TOKEN_MAP[address.toLowerCase()];
    if (tokenLegacy) {
      symbol = tokenLegacy.underlyingSymbol;
      name = tokenLegacy.name;
    }

    const market = new Market(
      account,
      markRaw(cToken),
      markRaw(underlying),
      isEther,
      symbol,
      cSymbol,
      name,
      address,
    );

    return shallowReactive(market);
  }

  public initialize() {
    /*
    // Update market on Transfer event
    this.subscribe('Transfer', () => {
      void this.update();
    });
    */

    return this;
  }

  public subscribe(event: string, callback: (...args: unknown[]) => void) {
    // account.comptroller.methods.on({ address: account.ethAccount }, (to, amount, from) => {
    //   console.log('comptroller', to, amount, from);
    // });

    this.underlying.methods.on(event, callback);
    this.subscribes.push({ event, callback });
  }

  public destroy() {
    this.subscribes.forEach(({ event, callback }) => {
      this.underlying.methods.off(event, callback);
    });
  }

  public async update(
    eRSDL?: Market,
    balances?: Market['_balances'],
    tokenMetadata?: Market['_tokenMetadata'],
    underlyingPrice?: Market['_underlyingPrice'],
    earned?: Market['earned'],
  ) {
    if (process.env.NODE_ENV !== 'production') {
      if (!isProxy(this)) {
        // eslint-disable-next-line no-console
        console.warn('[App warn]: Market#update is not in reactivity');
      }
    }

    if (eRSDL) {
      this.eRSDL = eRSDL;
    }

    if (earned) {
      this.earned = earned;
    }

    await this.updateAsyncSettings(
      balances,
      tokenMetadata,
      underlyingPrice,
    );

    return this;
  }

  private async updateAsyncSettings(
    balances?: Market['_balances'],
    tokenMetadata?: Market['_tokenMetadata'],
    underlyingPrice?: Market['_underlyingPrice'],
  ) {
    const { address } = this;
    const { ethAccount, compoundLens, comptroller } = this.account;

    const promises0 = [
      balances || compoundLens.methods.cTokenBalances(address, ethAccount),
      tokenMetadata || compoundLens.methods.cTokenMetadata(address),
      underlyingPrice ? { underlyingPrice } : compoundLens.methods.cTokenUnderlyingPrice(address),
    ] as const;

    const promises1 = [
      this.cErc20.methods.totalBorrows(),
      this.cErc20.methods.totalSupply(),

      comptroller.methods.mintGuardianPaused(address).then((_) => !_),
      comptroller.methods.borrowGuardianPaused(address).then((_) => !_),
      comptroller.methods.compSpeeds(address),

      this.cErc20.methods.exchangeRateStored(),
      this.cErc20.methods.getCash(),
      comptroller.methods.checkMembership(ethAccount, address),
    ] as const;

    [
      this._balances,
      this._tokenMetadata,

      {
        underlyingPrice: this._underlyingPrice,
      },
    ] = await Promise.all(promises0);

    this.supply_apy = calculateAPY(this._tokenMetadata.supplyRatePerBlock);
    this.borrow_apy = calculateAPY(this._tokenMetadata.borrowRatePerBlock);

    [
      this._totalBorrows,
      this._totalSupply,

      this.supply_allowed,
      this.borrow_allowed,
      this._compSpeeds,

      this._exchangeRateStored,
      this._liquidity,
      this.isEnteredTheMarket,
    ] = await Promise.all(promises1);
    return this;
  }

  private async getGasFee(value: BigNumber) {
    const { cToken } = this._tokenMetadata;
    const { account } = this;

    const estimateGasOptions = {
      from: account.ethAccount,
      to: cToken,
      data: '0x1249c58b',
      value,
    };

    const promises = [
      account.web3Provider.getFeeData(),
      account.web3Provider.estimateGas(estimateGasOptions),
    ] as const;

    const [
      { maxFeePerGas, maxPriorityFeePerGas },
      gas,
    ] = await Promise.all(promises);

    const fee = (
      // fee = gas * (baseFee + priorityFee);
      maxFeePerGas?.add(maxPriorityFeePerGas || 0).mul(gas)
      || BigNumber.from(0)
    );

    return { fee, gas };
  }

  private async getMaxMintAmount(mintAmount: BigNumber) {
    const { fee, gas } = await this.getGasFee(mintAmount);

    const { tokenBalance } = this._balances;
    const amount = tokenBalance.sub(fee);

    return {
      amount: amount.gt(0) ? amount : BigNumber.from(0),
      fee,
      gas,
    };
  }

  public async checkInMarkets() {
    const markets = await this.account.comptroller.methods.getAllMarkets();
    return markets.includes(this.address);
  }

  public async watchTx(args: ContractTransaction | AfterParams<ContractTransaction>) {
    const tx = 'response' in args ? args.response : args;

    try {
      this.loading = true;
      await this.account.wallet.watchTx(tx);
    } finally {
      this.loading = false;
    }
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public async mint(mintAmount: BigNumber) {
    const { cErc20 } = this;

    if (!this.isEther) {
      return cErc20.mint(mintAmount);
    }

    const { amount, gas } = await this.getMaxMintAmount(mintAmount);
    if (amount.lt(mintAmount)) {
      const overridesEth = { gasLimit: +gas };
      return cErc20.mint(amount, overridesEth);
    }

    return cErc20.mint(mintAmount);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public async approve(cToken: string) {
    return this.underlying.approve(cToken);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public async borrow(borrowAmount: BigNumber) {
    return this.cErc20.borrow(borrowAmount);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public async redeem(value: BigNumber) {
    return this.cErc20.redeem(value);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public async repayBorrow(value: BigNumber) {
    return this.cErc20.repayBorrow(value);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public enterToMarket() {
    const { cToken } = this._tokenMetadata;
    return this.account.comptroller.methods.enterMarkets([cToken]);
  }

  @after<Market>({ func: 'watchTx', wait: true })
  public exitFromMarket() {
    const { cToken } = this._tokenMetadata;
    return this.account.comptroller.methods.exitMarket(cToken);
  }

  public redeemAllowed(redeemAmount: BigNumber) {
    const { cToken } = this._tokenMetadata;

    return this.account.comptroller.methods.redeemAllowed(
      cToken,
      this.account.ethAccount,
      redeemAmount,
    );
  }

  public borrowAllowed(borrowAmount: BigNumber) {
    const { cToken } = this._tokenMetadata;

    return this.account.comptroller.methods.borrowAllowed(
      cToken,
      this.account.ethAccount,
      borrowAmount,
    );
  }

  public get supply_distribution_apy() {
    if (this._totalBorrows.eq(0) || this._compSpeeds.eq(0)) return 0;

    const { eRSDL } = this;

    // TODO: 365 days in year ???
    const compSpeeds = this._compSpeeds.mul(100 * 4 * 60 * 24 * 365).mul(eRSDL._underlyingPrice);

    const value = this._totalSupply.mul(this._exchangeRateStored).mul(this._underlyingPrice);

    const big = (100n * BigInt(compSpeeds.toString())) / (BigInt(value.toString()) / BigInt(1e18));

    return Number(big) / 100;
  }

  public get borrow_distribution_apy() {
    if (this._totalBorrows.eq(0) || this._compSpeeds.eq(0)) return 0;

    const { eRSDL } = this;

    // TODO: 365 days in year ???
    const compSpeeds = this._compSpeeds.mul(100 * 4 * 60 * 24 * 365).mul(eRSDL._underlyingPrice);

    const value = this._totalBorrows.mul(this._underlyingPrice);

    const big = (100n * BigInt(compSpeeds.toString())) / BigInt(value.toString());

    return Number(big) / 100;
  }

  public get underlyingDecimals() {
    return +this._tokenMetadata.underlyingDecimals;
  }

  public get balance() {
    return formatUnits(
      this._balances.tokenBalance,
      this._tokenMetadata.underlyingDecimals,
    );
  }

  public get supply_balance() {
    return formatUnits(
      this._balances.balanceOfUnderlying,
      this._tokenMetadata.underlyingDecimals,
    );
  }

  public get borrow_balance() {
    return formatUnits(
      this._balances.borrowBalanceCurrent,
      this._tokenMetadata.underlyingDecimals,
    );
  }

  public get allowance_balance() {
    if (this.isEther) return this.balance;

    return formatUnits(
      this._balances.tokenAllowance,
      this._tokenMetadata.underlyingDecimals,
    );
  }

  public get isSupply() {
    return (
      this.supply_allowed
      && this._balances.balanceOfUnderlying.eq(0)
    );
  }

  public get isUserSupplied() {
    return this._balances.balanceOfUnderlying.gt(0);
  }

  public get isBorrow() {
    return (
      this.borrow_allowed
      && this._balances.borrowBalanceCurrent.eq(0)
    );
  }

  public get isUserBorrowed() {
    return this._balances.borrowBalanceCurrent.gt(0);
  }

  public get isTokensGeneratingRewards() {
    return (
      this._balances.balanceOfUnderlying.gt(0)
      && this.supply_distribution_apy > 0
    ) || (
      this._balances.borrowBalanceCurrent.gt(0)
      && this.borrow_distribution_apy > 0
    );
  }

  public get isListed() {
    return this._tokenMetadata.isListed;
  }

  public get liquidity() {
    return formatUnits(
      this._liquidity,
      this._tokenMetadata.underlyingDecimals,
    );
  }

  public get liquidity_usd() {
    return convertToUsd(
      this._liquidity,
      this._underlyingPrice,
    );
  }

  public get price_usd() {
    return convertToUsd(
      BigNumber.from(10).pow(this._tokenMetadata.underlyingDecimals),
      this._underlyingPrice,
    );
  }

  public get tokens_available_usd() {
    const result = this.liquidity_usd / this.price_usd;
    return +toFixed(result, 2);
  }

  public get fiat_supply() {
    return this._underlyingPrice.eq(0)
      ? 0
      : convertToUsd(
        this._balances.balanceOfUnderlying,
        this._underlyingPrice,
      );
  }

  public get fiat_borrow() {
    return this._underlyingPrice.eq(0)
      ? 0
      : convertToUsd(
        this._balances.borrowBalanceCurrent,
        this._underlyingPrice,
      );
  }
}
