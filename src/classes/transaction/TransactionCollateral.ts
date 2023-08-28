import { Market } from '@/types/common.d';
import { formatSymbol } from '@/helpers/formatters/legacy';

import { ITransactionMarket } from './types';
import { TransactionBase } from './TransactionBase';
import { TransactionTypes } from './utils-common';
import {
  TransactionGeneratorExitFromMarket,
  TransactionGeneratorEnterToMarket,
} from './transaction-generators';


const createSettingsMap = (market: Market) => ({
  ENABLE: {
    title: 'Enable as Collateral',
    description: `
      Each asset used as collateral increases your borrowing limit.
      Be careful, this can subject the asset to being seized in liquidation.
    `,
    btn_text: `USE ${formatSymbol(market.symbol)} AS COLLATERAL`,
  },
  DISABLE: {
    title: 'Disable as Collateral',
    description: `
      This asset will no longer be used towards your borrowing limit,
      and can’t be seized in liquidation.
    `,
    btn_text: `DISABLE ${formatSymbol(market.symbol)}`,
  },
  BORROWING: {
    title: 'Collateral Required',
    description: `
      You are borrowing this asset.
      In order to exit market you have to repay it first.
    `,
    btn_text: 'DISMISS',
  },
  REQUIRED: {
    title: 'Collateral Required',
    description: `
      This asset is required to support your borrowed assets.
      Either repay borrowed assets, or supply another asset as collateral.
    `,
    btn_text: 'DISMISS',
  },
} as const);

export class TransactionCollateral extends TransactionBase implements ITransactionMarket {
  protected readonly type = TransactionTypes.collateral;

  protected readonly settings_map: ReturnType<typeof createSettingsMap>;

  constructor(
    public readonly market: Market,
  ) {
    super(market);
    this.value = market.supply_balance;
    this.settings_map = createSettingsMap(market);
  }

  protected get isCollateralRequired() {
    const { total_borrow } = this.market.account;
    const { hypothetical_borrow_limit } = this.limits[0] as { hypothetical_borrow_limit: number };

    return (
      total_borrow > 0
      && hypothetical_borrow_limit < total_borrow
    );
  }

  protected get settings() {
    const { settings_map, market } = this;

    if (this.isCollateralRequired) {
      return settings_map.REQUIRED;
    }

    if (+market.borrow_balance > 0) {
      return settings_map.BORROWING;
    }

    if (!market.isEnteredTheMarket) {
      return settings_map.ENABLE;
    }

    return settings_map.DISABLE;
  }

  public get title() {
    return this.settings.title;
  }

  public get description() {
    return this.settings.description;
  }

  public get btn_text() {
    return this.settings.btn_text;
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.market.account.wallet;
    if (!isSelectedEthAccount) return true;

    return false;
  }

  public btnAction() {
    const { market, type } = this;
    const value = '';

    if (this.btn_text === 'DISMISS') {
      return Promise.resolve(true);
    }

    const generator = market.isEnteredTheMarket
      ? TransactionGeneratorExitFromMarket(market)
      : TransactionGeneratorEnterToMarket(market);

    // eslint-disable-next-line object-curly-newline
    return this.executor({ generator, type, market, value });
  }

  public balance_text = 'Wallet balance';

  public get balance_amount() {
    return this.market.balance;
  }

  // eslint-disable-next-line class-methods-use-this
  public getMax() {
    return '0';
  }

  public validate() {
    if (this.btn_text === 'DISMISS') {
      return Promise.resolve(true);
    }

    return this.validateCommon();
  }
}
