import { Account, Market } from '@/types/common.d';
import { TransactionActionTypes } from './utils-common';


type ITransactionGenNext =
| {
  type: TransactionActionTypes;
  txHash: undefined;
}
| {
  type: TransactionActionTypes;
  txHash: string;
}

interface ITransactionCommon {
  btn_text: string;
  btn_disabled: boolean;
  btnAction: (isMaxValue: boolean) => (
    | void
    | Promise<boolean>
    | AsyncGenerator<ITransactionGenNext, boolean, unknown>
  );
}

export interface ITransactionMarket extends ITransactionCommon {
  market: Market;
  value: `${number}`;

  balance_text: string;
  balance_amount: `${number}`;

  update: (value: string) => void;

  validate: (isMaxValue?: boolean) => Promise<boolean | string>;
}

export interface ITransactionAccount extends ITransactionCommon {
  account: Account;
}
