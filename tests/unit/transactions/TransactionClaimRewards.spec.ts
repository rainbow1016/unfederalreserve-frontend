import { TransactionClaimRewards } from '@/classes/transaction/TransactionClaimRewards';
import { Wallet } from '@/classes/Wallet';

import {
  mockedCreateTransactionExecutorGenerator,
  mockedCreateClaimRewardsLimits,
  mockedAccount,

  resetBeforeEach,
} from './utils';


jest.mock('@/classes/transaction/transaction-executor-generator');
jest.mock('@/classes/transaction/transaction-generators');
jest.mock('@/classes/transaction/utils-limits');


beforeEach(() => {
  resetBeforeEach();
});

const UNCLAIMED_REWARDS_VALUES = [
  ['0', '0', false],
  ['0.0000000000000001', '0', false],
  ['0.0001', '0', false],
  ['12454', '12,454', true],
  ['22.001', '22.001', true],
  ['123456.003451', '123,456.003', true],
  ['12.00003451', '12', true],
  ['99999999999999', '99,999,999,999,999', true],
] as const;

describe('Test TransactionClaimRewards', () => {
  it('should create generator on exec new instance', () => {
    expect(mockedCreateTransactionExecutorGenerator).toBeCalledTimes(0);
    void new TransactionClaimRewards(mockedAccount);
    expect(mockedCreateTransactionExecutorGenerator).toBeCalledTimes(1);
  });

  it('should has limits with value', () => {
    const transaction = new TransactionClaimRewards(mockedAccount);

    expect(mockedCreateClaimRewardsLimits).toBeCalledTimes(0);
    void transaction.limits;
    expect(mockedCreateClaimRewardsLimits).toBeCalledTimes(1);

    const calls = mockedCreateClaimRewardsLimits.mock.calls[0];

    expect(calls).toMatchObject([
      mockedAccount,
    ]);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.each(UNCLAIMED_REWARDS_VALUES)(
    '- on exec validate method with unclaimed_rewards "%s"',
    (value, valueFormatted, isValid) => {
      const account = {
        unclaimed_rewards: value,
        updateCompBalance: () => Promise.resolve(void 0),
        wallet: {
          isSelectedEthAccount: true,
        } as unknown as Wallet,
      } as unknown as typeof mockedAccount;

      const text = isValid
        ? 'CLAIM {value} eRSDL'.replace('{value}', valueFormatted)
        : 'NOTHING TO CLAIM';

      const validValue = isValid ? true : text;
      const transaction = new TransactionClaimRewards(account);

      it(`should btn_text with text "${text}"`, () => {
        expect(transaction.btn_text).toBe(text);
      });

      it(`should btn_disabled with value "${!isValid}"`, () => {
        expect(transaction.btn_disabled).toBe(!isValid);
      });

      it('should exec updateCompBalance', async () => {
        const updateCompBalanceSpy = jest.spyOn(account, 'updateCompBalance');

        expect(updateCompBalanceSpy).toBeCalledTimes(0);
        await transaction.validate();
        expect(updateCompBalanceSpy).toBeCalledTimes(1);
      });

      it(`should returned value "${validValue}"`, async () => {
        const result = await transaction.validate();
        expect(result).toBe(validValue);
      });
    },
  );
});
