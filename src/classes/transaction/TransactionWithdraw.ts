import { utils } from 'ethers';
import { Market } from '@/types/common.d';
import { formatUnits } from '@/helpers/formatUnits';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import { TransactionGeneratorRedeem } from './transaction-generators';
import { MIN_USD_BALANCE } from '@/helpers/enums/params';


const { parseUnits } = utils;

const convertToCValue = (market: Market, value: string) => {
  // eslint-disable-next-line no-underscore-dangle
  const { exchangeRateCurrent, underlyingDecimals } = market._tokenMetadata;
  const cValue = parseUnits(value, underlyingDecimals.add(18));
  return cValue.div(exchangeRateCurrent);
};

const getWithdrawBorrowDustUsd = (market: Market) => {
  const { total_borrow } = market.account;

  const hasBorrowDust = total_borrow !== 0 && total_borrow < MIN_USD_BALANCE;
  if (!hasBorrowDust || !market.isEnteredTheMarket) return '0';

  // eslint-disable-next-line no-underscore-dangle
  const decimals = +market._tokenMetadata.underlyingDecimals;

  // subtract totalBorrow dust from value if it's too small
  const dustAmountUsd = Math.ceil((total_borrow * (10 ** decimals)) / market.price_usd);

  // plus we need to leave 100% more to cover borrow dust
  return formatUnits(parseUnits(dustAmountUsd.toString()).mul(2), 18 + decimals);
};

const getWantToWithdraw = (
  market: Market,
  value: string,
  isMaxValue: boolean,
  withDust: boolean,
) => {
  // eslint-disable-next-line no-underscore-dangle
  const { balanceOf } = market._balances;

  const wantToWithdraw = isMaxValue
    ? balanceOf
    : convertToCValue(market, value);

  if (!withDust) return wantToWithdraw;

  const borrowDustUsd = getWithdrawBorrowDustUsd(market);
  const borrowDust = convertToCValue(market, borrowDustUsd).add(1);

  return wantToWithdraw.gt(balanceOf.sub(borrowDust))
    ? wantToWithdraw.sub(borrowDust)
    : wantToWithdraw;
};

export class TransactionWithdraw extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.withdraw;

  private get isEnoughLiquidity() {
    return parseUnits(this.value).lte(parseUnits(this.market.liquidity));
  }

  private get hypothetical_borrow_limit_used() {
    return this.limits[1]?.hypothetical_borrow_limit_used || 0;
  }

  public get btn_text() {
    const { market, value } = this;

    if (market.isListed === false) {
      return 'Token is currently archived';
    }

    if (+value === 0) {
      return 'Withdraw';
    }

    if (!this.isEnoughLiquidity) {
      return 'Not enough tokens available on the market';
    }

    if (this.hypothetical_borrow_limit_used >= 100) {
      return 'Borrow exceeds supply';
    }

    if (parseUnits(value).gt(parseUnits(market.supply_balance))) {
      return 'Insufficient liquidity';
    }

    return 'Withdraw';
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.market.account.wallet;
    if (!isSelectedEthAccount) return true;

    return (
      parseUnits(this.value).lte(0)
      || this.btn_text !== 'Withdraw'
    );
  }

  public async btnAction(isMaxValue: boolean) {
    const { market, type, value } = this;
    await market.update();

    let redeemAmount = getWantToWithdraw(market, value, isMaxValue, false);
    const withdrawAllowed = await market.redeemAllowed(redeemAmount);

    if (withdrawAllowed.gt(0)) {
      redeemAmount = getWantToWithdraw(market, value, isMaxValue, true);
    }

    const generator = TransactionGeneratorRedeem(market, redeemAmount);
    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = 'Currently supplying';

  public input_label = 'Withdraw Amount';

  public get balance_amount() {
    return this.market.supply_balance;
  }

  public getMax() {
    return this.balance_amount.toString();
  }

  public async validate(isMaxValue?: boolean) {
    const { market, value } = this;

    const isValid = await this.validateCommon();
    if (isValid !== true) return isValid;

    const wantToWithdraw = getWantToWithdraw(market, value, !!isMaxValue, true);

    if (wantToWithdraw.lt(1)) return 'The value is too small';

    try {
      const withdrawAllowed = await market.redeemAllowed(wantToWithdraw);

      if (!withdrawAllowed.eq(0)) {
        return 'Global token limit is exceeded, please try again tomorrow'; // TODO: check text
      }
      return true;
    } catch (error) {
      return 'Market borrow cap reached'; // TODO: check text
    }
  }
}
