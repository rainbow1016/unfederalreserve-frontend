import { WETH9 } from '@uniswap/sdk-core';
import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import { TransactionGeneratorAddToMetaMask } from './transaction-generators';


export class TransactionAddToMetaMask extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.approve;

  public isWETH = false;

  public get btn_text() {
    const cSymbol = this.isWETH ? 'WETH' : this.market.cSymbol;
    return this.btn_disabled ? `ADDED ${cSymbol}` : `ADD ${cSymbol} TO METAMASK`;
  }

  public btn_disabled = this.market.account.wallet.isSelectedEthAccount === false;

  private get WETHTokenOptions() {
    // eslint-disable-next-line no-underscore-dangle
    const chainId = this.market.account.wallet.env?._CHAIN_ID as number;
    const token = WETH9[chainId];

    return {
      symbol: token.symbol as string,
      address: token.address,
      decimals: token.decimals,
    };
  }

  private get tokenOptions() {
    const { cSymbol } = this.market;
    // eslint-disable-next-line no-underscore-dangle
    const { cToken, cTokenDecimals } = this.market._tokenMetadata;

    return {
      symbol: cSymbol,
      address: cToken,
      decimals: +cTokenDecimals,
      image: `${window.location.origin}/icons/${cSymbol}.svg`,
    };
  }

  private get underlyingTokenOptions() {
    const { symbol } = this.market;

    const {
      underlyingDecimals,
      underlyingAssetAddress,
      // eslint-disable-next-line no-underscore-dangle
    } = this.market._tokenMetadata;

    return {
      symbol,
      address: underlyingAssetAddress,
      decimals: +underlyingDecimals,
      image: `${window.location.origin}/icons/${symbol}.svg`,
    };
  }

  public btnAction() {
    return this.isWETH
      ? this.addWETHToMetaMask()
      : this.addAssetToMetaMask(false);
  }

  public addAssetToMetaMask(isUnderlying: boolean) {
    const { market, type } = this;
    const options = isUnderlying ? this.underlyingTokenOptions : this.tokenOptions;
    const generator = TransactionGeneratorAddToMetaMask(options, isUnderlying);
    return this.executor({ generator, type, market });
  }

  public addWETHToMetaMask() {
    const { market, type } = this;
    const options = this.WETHTokenOptions;
    const generator = TransactionGeneratorAddToMetaMask(options, true);
    return this.executor({ generator, type, market });
  }

  public balance_text = '';

  public get balance_amount() {
    return this.market.balance;
  }

  // eslint-disable-next-line class-methods-use-this
  public getMax() {
    return '0';
  }

  public validate() {
    return this.validateCommon();
  }
}
