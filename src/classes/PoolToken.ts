/* eslint-disable no-underscore-dangle */

import { shallowReactive, markRaw } from 'vue';
import { BigNumber, constants } from 'ethersv5';

import { Account, Market, Position } from '@/types/common.d';
import { CToken } from '@/classes/CToken';
import { Token } from '@/classes/Token';

import { formatUnits } from '@/helpers/formatUnits';
import { CURRENCIES } from '@/helpers/enums/currencies';
import { ETH_ADDRESS } from '@/helpers/enums/params';


export class PoolToken {
  private contract: CToken | Token;

  private _allowanceBalance: BigNumber = BigNumber.from(0);

  private _balance: BigNumber = BigNumber.from(0);

  public value = '';

  public amount = '';

  public icon: string;

  public allowanceBalance: `${number}` = '0';

  public balance: `${number}` = '0';

  public isEther = false;

  private constructor(
    public readonly address: string,
    public readonly symbol: string,
    public readonly decimals: number,
    public readonly account: Account,
    public readonly market?: Market,
  ) {
    this.icon = CURRENCIES[symbol];

    this.isEther = symbol.includes('ETH');

    const contract = this.isEther
      ? new CToken(address, account.web3Provider, true)
      : new Token(address, account.web3Provider);

    this.contract = markRaw(contract);
  }

  public static buildClass(
    market: Market,
  ) {
    const poolToken = new PoolToken(
      market._tokenMetadata.underlyingAssetAddress.toLowerCase(),
      market.symbol,
      market.underlyingDecimals,
      market.account,
      market,
    );

    return shallowReactive(poolToken);
  }

  public static buildFromPosition(
    position: Position,
  ) {
    const {
      base,
      quote,
      amountQuote,
      amountBase,
    } = position;

    const { markets } = position.account;
    const baseSymbol = base.symbol?.replace('WETH', 'ETH');
    const quoteSymbol = quote.symbol?.replace('WETH', 'ETH');

    const baseAddress = baseSymbol === 'ETH' ? ETH_ADDRESS : base.address.toLowerCase();
    const quoteAddress = quoteSymbol === 'ETH' ? ETH_ADDRESS : quote.address.toLowerCase();

    const baseMarket = markets.find((_) => (
      _._tokenMetadata.underlyingAssetAddress.toLowerCase() === baseAddress
    ));

    const quoteMarket = markets.find((_) => (
      _._tokenMetadata.underlyingAssetAddress.toLowerCase() === quoteAddress
    ));

    const poolTokenBase = new PoolToken(
      baseAddress,
      baseSymbol || 'UNKNOWN',
      base.decimals,
      position.account,
      baseMarket,
    );

    const poolTokenQuote = new PoolToken(
      quoteAddress,
      quoteSymbol || 'UNKNOWN',
      quote.decimals,
      position.account,
      quoteMarket,
    );

    poolTokenBase.amount = amountBase;
    poolTokenQuote.amount = amountQuote;

    return {
      base: shallowReactive(poolTokenBase),
      quote: shallowReactive(poolTokenQuote),
    };
  }

  public async update() {
    const promises = [
      this.updateAllowance(),
      this.updateBalance(),
      this.market?.update().then(() => this.updateBalance()),
    ] as const;

    return Promise.all(promises);
  }

  public async updateAllowance() {
    const owner = this.account.ethAccount;
    const spender = this.account.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS;

    const allowanceBalance = !this.isEther
      ? await this.contract.methods.allowance(owner, spender)
      : constants.MaxUint256;

    this._allowanceBalance = allowanceBalance;

    this.allowanceBalance = formatUnits(
      allowanceBalance,
      this.decimals,
    );

    return this;
  }

  public async updateBalance() {
    const owner = this.account.ethAccount;

    const balance = this.market
      ? this.market?._balances.tokenBalance
      : await this.contract.methods.balanceOf(owner);

    this._balance = balance;

    this.balance = formatUnits(
      balance,
      this.decimals,
    );

    return this;
  }

  public approve(token: string) {
    return this.contract.approve(token);
  }

  public get price_usd() {
    return this.market?.price_usd || 0;
  }

  public get isApproved() {
    return (
      +this.value === 0
      || +this.allowanceBalance >= +this.value
    );
  }
}
