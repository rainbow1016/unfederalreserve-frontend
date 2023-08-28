import { utils, constants } from 'ethers';
import { Market } from '@/types/common.d';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import {
  TransactionGeneratorApproveForMarket,
  TransactionGeneratorRepayBorrow,
} from './transaction-generators';


const { parseUnits } = utils;

const getWantToRepay = (market: Market, value: string, isMaxValue?: boolean) => {
  if (isMaxValue) {
    return market.isEther
      // eslint-disable-next-line no-underscore-dangle
      ? market._balances.borrowBalanceCurrent
      : constants.MaxUint256;
  }

  // eslint-disable-next-line no-underscore-dangle
  return parseUnits(value, market._tokenMetadata.underlyingDecimals);
};

export class TransactionRepay extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.repay;

  protected isMax = false;

  public get btn_text() {
    const { market } = this;
    const { value } = this;

    if (market.isListed === false) {
      return 'Token is currently archived';
    }

    if (parseUnits(market.allowance_balance).eq(0)) {
      return 'Approve';
    }

    if (parseUnits(market.borrow_balance).lt(parseUnits(value))) {
      return "Value can't exceed borrowed amount";
    }

    if (parseUnits(market.balance).lt(parseUnits(value))) {
      return 'Insufficient wallet balance';
    }

    if (parseUnits(value).gt(parseUnits(market.allowance_balance))) {
      return 'Need approve more allowance before repay';
    }

    if (this.isMax) {
      // eslint-disable-next-line no-underscore-dangle
      const { tokenAllowance, tokenBalance } = market._balances;

      if (tokenAllowance.gt(0) && tokenBalance.gt(tokenAllowance)) {
        return 'Need approve more allowance before repay';
      }
    }

    return 'Repay';
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.market.account.wallet;
    if (!isSelectedEthAccount) return true;

    if (this.btn_text === 'Approve') {
      return false;
    }

    return (
      parseUnits(this.value).lte(0)
      || ![
        'Repay',
        'Need approve more allowance before repay',
      ].includes(this.btn_text)
    );
  }

  public async btnAction(isMaxValue: boolean) {
    const { market, type, value } = this;
    const isApprove = this.btn_text === 'Approve';

    // eslint-disable-next-line no-underscore-dangle
    const { tokenBalance, tokenAllowance } = market._balances;

    const wantToRepay = getWantToRepay(market, value, isMaxValue);

    const isNeedApprove = (
      !market.isEther
      && (
        // when isMaxValue - need set wantToRepay as MaxUint256 and we do not have
        // approve with MaxUint256, try max tokenBalance in his wallet check
        tokenAllowance.lt(isMaxValue ? tokenBalance : wantToRepay)
        || isApprove
      )
    );

    if (isNeedApprove) {
      const generator = TransactionGeneratorApproveForMarket(market);
      // eslint-disable-next-line object-curly-newline
      const result = await this.executor({ generator, type, market, value });
      if (!result || isApprove) return result;
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
    }

    const generator = TransactionGeneratorRepayBorrow(market, wantToRepay);
    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = 'Wallet balance';

  public input_label = 'Repay Amount';

  public get balance_amount() {
    return this.market.balance;
  }

  public update(value: string, checkbox?: boolean, isMax = false) {
    super.update(value);
    this.isMax = isMax;
    return this;
  }

  public getMax() {
    const { borrow_balance } = this.market;
    return borrow_balance;
  }

  public getPossibleMax() {
    const { borrow_balance, balance } = this.market;

    if (parseUnits(balance).eq(0)) {
      return borrow_balance;
    }

    return parseUnits(borrow_balance).lt(parseUnits(balance))
      ? borrow_balance.toString()
      : balance.toString();
  }

  public validate() {
    return this.validateCommon();
  }
}
