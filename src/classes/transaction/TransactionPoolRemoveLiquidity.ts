import { getRemovePositionTransactionData } from '@/classes/Position';
import { Await } from '@/types/utils';
import { Market, Position } from '@/types/common.d';

import {
  TransactionGeneratorRemoveLiquidityPosition,
} from './transaction-generators';
import {
  createRemoveLiquidityUniswapPositionExecutorGenerator,
} from './transaction-executor-generator';


type ITransaction = Await<ReturnType<typeof getRemovePositionTransactionData>>;

export class TransactionPoolRemoveLiquidity {
  private executor = createRemoveLiquidityUniswapPositionExecutorGenerator();

  constructor(
    private position: Position,
  ) {
    this.update(position);
  }

  public update(position: Position) {
    this.position = position;
  }

  public async getTransaction(percentSlider: number, asWETH: boolean) {
    try {
      const transaction = await getRemovePositionTransactionData(
        this.position,
        percentSlider,
        asWETH,
      );
      return transaction;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return void 0;
    }
  }

  public removeLiquidity(transaction: ITransaction, asWETH: boolean) {
    if (!transaction) return false;
    const { account, baseMarket, quoteMarket } = this.position;
    const generator = TransactionGeneratorRemoveLiquidityPosition(account, transaction);
    const marketA = baseMarket as Market;
    const marketB = quoteMarket as Market;
    // eslint-disable-next-line object-curly-newline
    const params = { generator, account, marketA, marketB, asWETH };
    return this.executor(params);
  }
}
