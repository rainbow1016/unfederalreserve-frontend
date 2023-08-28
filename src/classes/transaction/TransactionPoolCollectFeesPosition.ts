import { Position } from '@/types/common.d';
import { getCollectFeesPositionTransactionData } from '@/classes/Position';
import { Await } from '@/types/utils';
import { TransactionGeneratorCollectFeesPosition } from '@/classes/transaction/transaction-generators';
import { createCollectFeesPositionExecutorGenerator } from '@/classes/transaction/transaction-executor-generator';


type ITransaction = Await<ReturnType<typeof getCollectFeesPositionTransactionData>>;

export class TransactionPoolCollectFeesPosition {
  private addExecutor = createCollectFeesPositionExecutorGenerator();

  public collectFees(position: Position, transaction: ITransaction, asWETH: boolean) {
    if (!transaction) return false;
    const { account, baseMarket, quoteMarket } = position;
    const generator = TransactionGeneratorCollectFeesPosition(account, transaction);
    // eslint-disable-next-line object-curly-newline
    const params = { generator, account, asWETH, marketA: quoteMarket, marketB: baseMarket };
    return this.addExecutor(params);
  }

  // eslint-disable-next-line class-methods-use-this
  public async getTransaction(position: Position, asWETH = false) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return await getCollectFeesPositionTransactionData(position, asWETH);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return void 0;
    }
  }
}
