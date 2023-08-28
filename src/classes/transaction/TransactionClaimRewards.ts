import { Account } from '@/types/common.d';
import { formatToNumber } from '@/helpers/formatters';

import { ITransactionAccount } from './types';
import { createClaimRewardsLimits } from './utils-limits';
import { TransactionGeneratorClaimRewards } from './transaction-generators';
import { createTransactionExecutorGenerator } from './transaction-executor-generator';


export class TransactionClaimRewards implements ITransactionAccount {
  protected readonly executor: ReturnType<typeof createTransactionExecutorGenerator>;

  constructor(
    public readonly account: Account,
  ) {
    this.executor = createTransactionExecutorGenerator();
  }

  // getter because market may be changed
  public get limits() {
    return createClaimRewardsLimits(
      this.account,
    );
  }

  public get btn_text() {
    const { unclaimed_rewards } = this.account;
    const value = formatToNumber(unclaimed_rewards);

    if (value !== '0') {
      return `CLAIM ${value} eRSDL`;
    }

    return 'NOTHING TO CLAIM';
  }

  public get btn_disabled() {
    const { isSelectedEthAccount } = this.account.wallet;
    if (!isSelectedEthAccount) return true;

    return this.btn_text === 'NOTHING TO CLAIM';
  }

  public btnAction() {
    const { account } = this;
    const generator = TransactionGeneratorClaimRewards(account);
    return this.executor({ generator, account });
  }

  public async validate() {
    await this.account.updateCompBalance();
    if (this.btn_disabled) return this.btn_text;
    return true;
  }
}
