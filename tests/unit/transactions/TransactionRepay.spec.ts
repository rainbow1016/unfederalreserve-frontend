import { TransactionTypes } from '@/classes/transaction';
import { TransactionRepay } from '@/classes/transaction/TransactionRepay';

import {
  mockedCreateTransactionExecutorGenerator,
  mockedCreateTransactionLimitsList,
  mockedMarket,

  TRANSACTION_INPUT_VALUES,

  resetBeforeEach,
} from './utils';


jest.mock('@/classes/transaction/transaction-executor-generator');
jest.mock('@/classes/transaction/transaction-generators');
jest.mock('@/classes/transaction/utils-limits');


beforeEach(() => {
  resetBeforeEach();
});

const TRANSACTION_VALIDATION_STATUSES = [
  ['Market __SYMBOL__ is not available', false],
  ['Token is currently archived', false],
  ['Approve', true],
  ["Value can't exceed borrowed amount", false],
  ['Insufficient wallet balance', false],
  ['Need approve more allowance before repay', true],
  ['Repay', true],
] as const;

describe('Test TransactionRepay', () => {
  it('should create generator on exec new instance', () => {
    expect(mockedCreateTransactionExecutorGenerator).toBeCalledTimes(0);
    void new TransactionRepay(mockedMarket);
    expect(mockedCreateTransactionExecutorGenerator).toBeCalledTimes(1);
  });

  it.each(TRANSACTION_INPUT_VALUES)(
    'should has limits with value "%s" -> "%s"',
    (input_value, input_result) => {
      const transaction = new TransactionRepay(mockedMarket);

      transaction.update(input_value);

      expect(mockedCreateTransactionLimitsList).toBeCalledTimes(0);
      void transaction.limits;
      expect(mockedCreateTransactionLimitsList).toBeCalledTimes(1);

      const calls = mockedCreateTransactionLimitsList.mock.calls[0];

      expect(calls).toMatchObject([
        mockedMarket,
        TransactionTypes.repay,
        input_result,
      ]);
    },
  );

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('- on exec validate method', () => {
    it.each(TRANSACTION_VALIDATION_STATUSES)(
      'should returned value "%s" with result "%s"',
      async (text, enabled) => {
        const transaction = new TransactionRepay(mockedMarket);

        expect(transaction.btn_text).toBe(text);
        expect(transaction.btn_disabled).toBe(!enabled);

        const result = await transaction.validate();
        expect(result).toBe(enabled);
      },
    );
  });
});
