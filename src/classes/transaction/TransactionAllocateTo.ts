import { utils } from 'ethers';
import { Market } from '@/types/common.d';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import { TransactionGeneratorAllocateTo } from './transaction-generators';


export const getWantToFaucet = (market: Market, value: string) => {
  // eslint-disable-next-line no-underscore-dangle
  const { underlyingDecimals } = market._tokenMetadata;
  return utils.parseUnits(value, underlyingDecimals);
};

export class TransactionAllocateTo extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.approve;

  public btn_text = '';

  public btn_disabled = this.market.account.wallet.isSelectedEthAccount === false;

  public btnAction() {
    const { type, market } = this;

    const value = +this.value
      ? this.value
      // we give user $1000 equivalent of token
      // eslint-disable-next-line no-underscore-dangle
      : (1000 / this.market.price_usd).toFixed(+market._tokenMetadata.underlyingDecimals);

    const faucetAmount = getWantToFaucet(this.market, value);
    const generator = TransactionGeneratorAllocateTo(market, faucetAmount);
    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = '';

  public balance_amount = '' as `${number}`;

  // eslint-disable-next-line class-methods-use-this
  public getMax() {
    return '0';
  }

  public validate() {
    return this.validateCommon();
  }
}
