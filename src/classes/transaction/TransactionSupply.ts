import { utils } from 'ethers';
import { Market } from '@/types/common.d';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import {
  TransactionGeneratorApproveForMarket,
  TransactionGeneratorMint,
} from './transaction-generators';


const { parseUnits } = utils;

const getWantToSupply = (market: Market, value: string, isMaxValue: boolean) => {
  // eslint-disable-next-line no-underscore-dangle
  const { underlyingDecimals } = market._tokenMetadata;

  // eslint-disable-next-line no-underscore-dangle
  const { tokenBalance } = market._balances;

  if (isMaxValue) return tokenBalance;

  const wantToSupply = parseUnits(value, underlyingDecimals);

  return wantToSupply;
};

export class TransactionSupply extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.supply;

  private get isEnoughBalance() {
    return parseUnits(this.market.balance).gte(parseUnits(this.value));
  }

  public get btn_text() {
    const { market, value } = this;

    if (!market.supply_allowed) {
      return 'Supply is paused';
    }

    if (market.isListed === false) {
      return 'Token is currently archived';
    }

    if (!market.isEther) {
      if (parseUnits(market.allowance_balance).eq(0)) {
        return 'Approve';
      }

      if (parseUnits(value).gt(parseUnits(market.allowance_balance))) {
        return 'Need approve more allowance before supply';
      }
    }

    if (!this.isEnoughBalance) {
      return 'Insufficient wallet balance';
    }

    return 'Supply';
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.market.account.wallet;
    if (!isSelectedEthAccount) return true;

    if (this.btn_text === 'Approve') return false;

    return (
      parseUnits(this.value).lte(0)
      || ![
        'Supply',
        'Need approve more allowance before supply',
      ].includes(this.btn_text)
    );
  }

  public async btnAction(isMaxValue: boolean) {
    const { market, type, value } = this;
    await market.update();

    // eslint-disable-next-line no-underscore-dangle
    const { tokenAllowance } = market._balances;
    const wantToSupply = getWantToSupply(market, value, isMaxValue);
    const isApprove = this.btn_text === 'Approve';

    const isNeedApprove = (
      !market.isEther
      && (
        tokenAllowance.lt(wantToSupply)
        || isApprove
      )
    );

    if (isNeedApprove) {
      const generator = TransactionGeneratorApproveForMarket(market);
      // eslint-disable-next-line object-curly-newline
      const result = await this.executor({ generator, type, market, value });
      if (!result || isApprove) return result;
    }

    const generator = TransactionGeneratorMint(market, wantToSupply);
    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = 'Wallet balance';

  public input_label = 'Supply Amount';

  public get balance_amount() {
    return this.market.balance;
  }

  public getMax() {
    return this.balance_amount.toString();
  }

  public validate() {
    return this.validateCommon();
  }
}
