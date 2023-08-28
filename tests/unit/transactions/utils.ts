import { mocked } from 'ts-jest/utils';
import { Wallet, Account, Market } from '@/types/common.d';

import { createTransactionExecutorGenerator } from '@/classes/transaction/transaction-executor-generator';
import {
  TransactionGeneratorMint,
  TransactionGeneratorApproveForMarket,
} from '@/classes/transaction/transaction-generators';
import {
  createTransactionLimitsList,
  createClaimRewardsLimits,
} from '@/classes/transaction/utils-limits';


jest.mock('@/classes/transaction/transaction-executor-generator');
jest.mock('@/classes/transaction/transaction-generators');
jest.mock('@/classes/transaction/utils-limits');

export const mockedCreateTransactionExecutorGenerator = mocked(createTransactionExecutorGenerator, true);
export const mockedTransactionGeneratorApproveForMarket = mocked(TransactionGeneratorApproveForMarket, true);
export const mockedTransactionGeneratorMint = mocked(TransactionGeneratorMint, true);
export const mockedCreateTransactionLimitsList = mocked(createTransactionLimitsList, true);
export const mockedCreateClaimRewardsLimits = mocked(createClaimRewardsLimits, true);


export const mockedMarket = {
  symbol: '__SYMBOL__',
  account: {
    wallet: {
      isSelectedEthAccount: true,
    } as unknown as Wallet,
  } as unknown as Account,
  update: () => Promise.resolve(),
  checkInMarkets: () => Promise.resolve(true),
} as unknown as Market;

export const mockedAccount = {
  wallet: {
    isSelectedEthAccount: true,
  } as unknown as Wallet,

  get balance() {
    return 0;
  },

  get unclaimed_rewards() {
    return 0;
  },
} as unknown as Account;

export const TRANSACTION_INPUT_VALUES = [
  ['', '0'],
  ['0.000000000000000000001', '0.000000000000000000001'],
  [''.padStart(18, '9'), ''.padStart(18, '9')],
  ['12343', '12343'],
  ['0.00002222', '0.00002222'],
  ['123.00004646', '123.00004646'],
  ['__VALUE_STRING__', '0'],
];

export const resetBeforeEach = () => {
  jest.resetAllMocks();

  mockedCreateTransactionExecutorGenerator.mockImplementation(() => (
    jest.fn(() => Promise.resolve(true))
  ));

  mockedTransactionGeneratorApproveForMarket.mockImplementation(() => (
    jest.fn() as unknown as ReturnType<typeof TransactionGeneratorApproveForMarket>
  ));

  mockedTransactionGeneratorMint.mockImplementation(() => (
    jest.fn() as unknown as ReturnType<typeof TransactionGeneratorMint>
  ));
};
