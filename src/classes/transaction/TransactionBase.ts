import { Market } from '@/types/common.d';

import { TransactionTypes } from './utils-common';
import { createTransactionLimitsList } from './utils-limits';
import { createTransactionExecutorGenerator } from './transaction-executor-generator';


export abstract class TransactionBase {
  protected abstract readonly type: TransactionTypes;

  public readonly decimals: number;

  protected readonly executor: ReturnType<typeof createTransactionExecutorGenerator>;

  constructor(
    public readonly market: Market,
  ) {
    this.executor = createTransactionExecutorGenerator();
    this.decimals = +market.underlyingDecimals;
  }

  public value: `${number}` = '0';

  public abstract btn_disabled: boolean;

  public abstract btn_text: string;

  // getter because market may be changed
  public get limits() {
    return createTransactionLimitsList(
      this.market,
      this.type,
      this.value,
    );
  }

  public update(value: string): this;

  public update(value: string, checkbox: boolean): this;

  public update(value: string, checkbox: boolean, isMax: boolean): this;

  public update(value: string) {
    const val = parseFloat(value) || 0;
    this.value = (val === 0 ? '0' : value) as `${number}`;
    return this;
  }

  public abstract getMax(): string

  public getPossibleMax() {
    return this.getMax();
  }

  protected async validateCommon() {
    const { market } = this;

    await market.update();

    if (this.btn_disabled) {
      return this.btn_text;
    }

    const isInMarkets = await market.checkInMarkets();

    if (!isInMarkets) {
      return `Market ${market.symbol} is not available`;
    }

    return true;
  }
}
