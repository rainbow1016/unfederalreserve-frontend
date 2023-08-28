import { notify } from '@kyvg/vue3-notification';
import { Account, Market } from '@/types/common.d';

import { TRANSACTION_STATUSES } from '@/helpers/enums/params';


export type ITransactionGeneratorError = {
  reason: string;
  message: never;
  error: {
    code: number;
    data: unknown;
    message: string;
  };
} | {
  code: 4001;
  reason: never;
  message: string;
  error: never;
} | unknown;

export const transactionNotify = (params: {
  text: string;
  status: typeof TRANSACTION_STATUSES[keyof typeof TRANSACTION_STATUSES];
  txHash?: string;
  market?: Market;
  account?: Account;
  description?: string;
}) => {
  const {
    text,
    status,
    txHash,
    market,
    account,
    description,
  } = params;

  const type = status === TRANSACTION_STATUSES.FAILED ? 'error' : void 0;

  const notificationOptions = {
    text,
    duration: 10000,
    group: 'transaction',
    type,
    data: {
      status,
      txHash,
      market,
      account,
      description,
      duration: 10000,
    },
  };

  notify(notificationOptions);
};

export const transactionNotifySuccess = (params: {
  text?: string;
  description?: string;
  txHash?: string;
  market?: Market;
  account?: Account;
}) => {
  transactionNotify({
    ...params,
    text: params.text || 'Transaction confirmed',
    status: TRANSACTION_STATUSES.CONFIRMED,
  });
};

export const transactionNotifyError = (params: {
  error?: ITransactionGeneratorError;
  market?: Market;
  account?: Account;
  txHash?: string;
  text?: string;
}) => {
  let description = (
    // @ts-ignore ignore unknown
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    params.error?.error?.message
    // @ts-ignore ignore unknown
    || params.error?.reason
    // @ts-ignore ignore unknown
    || params.error?.message
  ) as string;

  let title = description
    ? 'Wallet returned an error'
    : params.text || '';

  const isDenied = description?.toLowerCase?.()
    .includes('user denied transaction signature');

  if (isDenied) {
    description = '';
    title = 'The user denied confirming the transaction.';
  }

  if (params.error) {
    // eslint-disable-next-line no-console
    console.warn(params.error);
  }

  transactionNotify({
    text: title,
    status: TRANSACTION_STATUSES.FAILED,
    description,
    market: params.market,
    account: params.account,
    txHash: params.txHash,
  });
};
