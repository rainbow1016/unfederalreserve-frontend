import { utils } from 'ethers';
import { Market } from '@/types/common.d';

import { MIN_TOKEN_VALUE } from '@/helpers/enums/params';
import { toFixed } from '@/helpers/toFixed';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import { TransactionGeneratorBorrow } from './transaction-generators';


const { parseUnits } = utils;

const getWantToBorrow = (market: Market, value: string) => {
  // eslint-disable-next-line no-underscore-dangle
  const { underlyingDecimals } = market._tokenMetadata;

  const borrowAmount = parseUnits(value, underlyingDecimals);

  return borrowAmount;
};

export class TransactionBorrow extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.borrow;

  private risk_checkbox = false;

  private get isEnoughLiquidity() {
    const { value, market } = this;

    return (
      parseUnits(value).gte(0)
      && parseUnits(value).lte(parseUnits(market.liquidity))
    );
  }

  private get hypothetical_borrow_limit_used() {
    return this.limits[1]?.hypothetical_borrow_limit_used || 0;
  }

  public get btn_text() {
    const { market } = this;
    const { account } = market;

    if (!market.borrow_allowed) {
      return 'Borrow is paused';
    }

    if (market.isListed === false) {
      return 'Token is currently archived';
    }

    if (account.borrow_limit_used >= 100) {
      return 'Borrowing limit reached';
    }

    if (!this.isEnoughLiquidity) {
      return 'Not enough tokens available on the market';
    }

    if (
      account.borrow_limit <= 0
      || this.hypothetical_borrow_limit_used >= 100
    ) {
      return 'Insufficient collateral';
    }

    return 'Borrow';
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.market.account.wallet;
    if (!isSelectedEthAccount) return true;

    return (
      !+this.value
      || !this.risk_checkbox
      || this.btn_text !== 'Borrow'
    );
  }

  public btnAction(isMaxValue: boolean) {
    const { market, type } = this;
    const value = isMaxValue ? this.getMax() : this.value;
    const borrowAmount = getWantToBorrow(this.market, value);
    const generator = TransactionGeneratorBorrow(market, borrowAmount);
    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = 'Currently Borrowing';

  public input_label = 'Borrow Amount';

  public get balance_amount() {
    return this.market.borrow_balance;
  }

  public update(value: string, checkbox = false) {
    super.update(value);
    this.risk_checkbox = checkbox;
    return this;
  }

  public getMax() {
    const { price_usd } = this.market;
    const { borrow_limit, total_borrow, borrow_limit_used } = this.market.account;
    // eslint-disable-next-line no-underscore-dangle
    const { underlyingDecimals } = this.market._tokenMetadata;

    if (borrow_limit <= 0) return '0';
    if (borrow_limit_used >= 80) return '0';

    const maxBorrow = ((borrow_limit * 0.8) - total_borrow) / price_usd;

    if (maxBorrow < MIN_TOKEN_VALUE) return '0';

    return toFixed(maxBorrow, +underlyingDecimals);
  }

  public getPossibleMax() {
    const max = this.getMax();
    const { liquidity } = this.market;

    return parseUnits(liquidity).lt(parseUnits(max)) ? liquidity : max;
  }

  public async validate() {
    const { market } = this;

    const isValid = await this.validateCommon();
    if (isValid !== true) return isValid;

    // eslint-disable-next-line no-underscore-dangle
    const { underlyingDecimals } = market._tokenMetadata;
    const borrowAmount = parseUnits(this.value, underlyingDecimals);

    // TODO: Figure out approach above https://git.io/JEz6w

    if (!market.isEnteredTheMarket) return true;

    try {
      const borrowAllowed = await market.borrowAllowed(borrowAmount);

      if (+borrowAllowed !== 0) {
        return 'Global token limit is exceeded, please try again tomorrow';
      }

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      return 'Market borrow cap reached';
    }
  }
}
