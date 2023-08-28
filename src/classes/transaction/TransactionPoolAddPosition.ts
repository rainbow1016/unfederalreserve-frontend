import { Position, PoolToken } from '@/types/common.d';
import { getAddPositionTransactionData } from '@/classes/Position';
import { Await } from '@/types/utils';
import { tryGetUniswapPool } from '@/classes/Position/useV3DerivedMintInfo';

import {
  TransactionGeneratorApproveForUniswapPool,
  TransactionGeneratorAddPosition,
} from './transaction-generators';
import {
  createAddUniswapPositionExecutorGenerator,
  createApproveUniswapPositionExecutorGenerator,
} from './transaction-executor-generator';


type ITransaction = Await<ReturnType<typeof getAddPositionTransactionData>>;

const getBtnText = (token: PoolToken) => {
  const value = +token.value;

  if (token.market?.isListed === false) {
    return `TOKEN ${token.symbol} IS CURRENTLY ARCHIVED`;
  }

  if (value && +token.balance < value) {
    return `INSUFFICIENT ${token.symbol} BALANCE`;
  }

  if (!token.isApproved) {
    return `APPROVE ${token.symbol}`;
  }

  return 'ADD';
};

export class TransactionPoolAddPosition {
  private addExecutor = createAddUniswapPositionExecutorGenerator();

  private approveExecutor = createApproveUniswapPositionExecutorGenerator();

  constructor(
    private tokenA: PoolToken,
    private tokenB: PoolToken,
  ) {
    this.update(tokenA, tokenB);
  }

  public update(tokenA: PoolToken, tokenB: PoolToken) {
    this.tokenA = tokenA;
    this.tokenB = tokenB;

    void tokenA.update();
    void tokenB.update();
  }

  public get btnTextA() {
    const { tokenA } = this;
    return getBtnText(tokenA);
  }

  public get btnTextB() {
    const { tokenB } = this;
    return getBtnText(tokenB);
  }

  public get btnText() {
    const btnTextA = getBtnText(this.tokenA);
    const btnTextB = getBtnText(this.tokenB);

    if (btnTextA !== 'ADD' && !btnTextA.includes('APPROVE')) {
      return btnTextA;
    }

    if (btnTextB !== 'ADD' && !btnTextB.includes('APPROVE')) {
      return btnTextB;
    }

    return 'PREVIEW';
  }

  public get btnDisabled() {
    return (
      !(+this.tokenA.value || +this.tokenB.value)
      || this.isApprovedA
      || this.isApprovedB
      || this.btnText !== 'PREVIEW'
    );
  }

  public get isApprovedA() {
    return (
      getBtnText(this.tokenA).includes('APPROVE')
    );
  }

  public get isApprovedB() {
    return (
      getBtnText(this.tokenB).includes('APPROVE')
    );
  }

  public async getTransaction(
    leftRange: string,
    rightRange: string,
    fee: 500 | 3000 | 10000,
    position?: Position,
  ) {
    try {
      const transaction = await getAddPositionTransactionData(
        this.tokenA,
        this.tokenB,
        leftRange,
        rightRange,
        fee,
        position,
      );
      return transaction;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return void 0;
    }
  }

  public async addPosition(
    transaction: ITransaction,
    positionData: Parameters<typeof TransactionGeneratorAddPosition>[2],
    position?: Position,
  ) {
    if (!transaction) return false;
    const { tokenA, tokenB } = this;
    const { account } = tokenA;

    const generator = TransactionGeneratorAddPosition(account, transaction, positionData);
    // eslint-disable-next-line object-curly-newline
    const params = { generator, account, tokenA, tokenB, position };
    return this.addExecutor(params);
  }

  public approveA() {
    const generator = TransactionGeneratorApproveForUniswapPool(this.tokenA);
    return this.approveExecutor({ generator, token: this.tokenA });
  }

  public approveB() {
    const generator = TransactionGeneratorApproveForUniswapPool(this.tokenB);
    return this.approveExecutor({ generator, token: this.tokenB });
  }

  public async getTokenPrice(fee: 500 | 3000 | 10000) {
    const { tokenA, tokenB } = this;
    if (!tokenA || !tokenB) return '0';
    const uniswapPool = await tryGetUniswapPool(tokenA.address, tokenB.address, fee);
    if (!uniswapPool) return (tokenA.price_usd / tokenB.price_usd).toString();
    const isInverted = tokenA.address.toLowerCase() !== uniswapPool.token0.address.toLowerCase();
    const key = isInverted ? 'token1Price' : 'token0Price';
    return uniswapPool[key].toFixed(18);
  }
}
