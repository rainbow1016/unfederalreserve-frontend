/* eslint-disable no-underscore-dangle */

import { shallowReactive, markRaw } from 'vue';
import { BigNumber } from 'ethers';

import { Account } from '@/types/common.d';
import { PositionsResponse } from '@/types/generated/uniswap/GNonfungiblePositionManager';
import { NonfungiblePositionManager } from '@/classes/NonfungiblePositionManager';
import { Await } from '@/types/utils';
import { formatUnits } from '@/helpers/formatUnits';
import {
  createUniswapPoolMemoized as createUniswapPool,
  getPriceOrderingFromPosition,
} from './utils';


const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

export class Position {
  public unclaimedAmount0?: BigNumber;

  public unclaimedAmount1?: BigNumber;

  public minPrice!: string;

  public maxPrice!: string;

  public amount0!: string;

  public amount1!: string;

  public token0Price!: string;

  public token1Price!: string;

  public ratio: number | undefined;

  private constructor(
    private positionManager: NonfungiblePositionManager,
    public account: Account,
    public positionData: PositionsResponse,
    public readonly uniswapPool: Await<ReturnType<typeof createUniswapPool>>,
    public readonly tokenId: string,

    public readonly base: typeof uniswapPool['token0'],
    public readonly quote: typeof uniswapPool['token1'],

    public readonly inverted: boolean | undefined,
  ) {
  }

  public static async getPositions(
    account: Account,
  ) {
    const { env, web3Provider, ethAccount } = account;

    const positionManager = (
      account.positions[0]?.positionManager
      || new NonfungiblePositionManager(
        env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        web3Provider,
      )
    );

    const balance = await positionManager.methods.balanceOf(ethAccount);
    const balancePrev = account.positions?.length || 0;

    const promises0 = Array.from({ length: +balance - balancePrev }, (_, index: number) => (
      positionManager.methods.tokenOfOwnerByIndex(ethAccount, index + balancePrev)
    ));

    let tokenIds = await Promise.all(promises0);
    const tokenIdsPrev = account.positions.map((_) => _.tokenId);
    tokenIds = tokenIds.filter((tokenId) => !tokenIdsPrev.includes(tokenId.toString()));

    const promises1 = tokenIds.map((tokenId) => (
      positionManager.methods.positions(tokenId)
    ));

    const positionsData = await Promise.all(promises1);

    const eRSDLAddress = account.markets.find((_) => _.symbol === 'eRSDL')
      ?.underlying.address.toLowerCase();

    const promises3 = positionsData.map((positionData, index) => {
      const witheRSDL = [
        positionData.token0.toLowerCase(),
        positionData.token1.toLowerCase(),
      ].includes(eRSDLAddress as string);

      if (!witheRSDL) return null;

      return this.buildClass(
        positionManager,
        account,
        positionData,
        tokenIds[index].toString() as `${number}`,
      );
    });

    const results = await Promise.all(promises3);
    const positions = results.filter(Boolean) as Position[];

    return account.positions.concat(positions);
  }

  private static async buildClass(
    positionManager: NonfungiblePositionManager,
    account: Account,
    positionData: PositionsResponse,
    tokenId: string,
  ) {
    const uniswapPool = await createUniswapPool(
      account.env,
      account.web3Provider,
      positionData.token0,
      positionData.token1,
      +positionData.fee,
    );

    const { base, quote } = getPriceOrderingFromPosition(positionData, uniswapPool);
    const inverted = uniswapPool.token0.equals(base);

    const position = new Position(
      positionManager,
      account,
      positionData,
      markRaw(uniswapPool),
      tokenId,
      base,
      quote,
      inverted,
    );

    return shallowReactive(position);
  }

  public update() {
    return this.updateOnce();
  }

  public async updateOnce() {
    const { ethAccount } = this.account;
    const { tokenId, uniswapPool, positionManager } = this;

    type TCollect = { amount0: BigNumber; amount1: BigNumber };

    const promise0 = positionManager.methods.callStatic.collect({
      tokenId,
      recipient: ethAccount,
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128,
    }, { from: ethAccount }) as Promise<TCollect>;

    void promise0
      .catch(() => null)
      .then((collect) => {
        this.unclaimedAmount0 = collect?.amount0;
        this.unclaimedAmount1 = collect?.amount1;
        return collect;
      });

    const positionData = await positionManager.methods.positions(tokenId);
    this.positionData = positionData;

    const {
      minPrice,
      maxPrice,
      ratio,
      amount0,
      amount1,
      token0Price,
      token1Price,
    } = getPriceOrderingFromPosition(positionData, uniswapPool);

    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.ratio = ratio;
    this.amount0 = amount0;
    this.amount1 = amount1;
    this.token0Price = token0Price;
    this.token1Price = token1Price;

    return this;
  }

  public get baseMarket() {
    const { base } = this;
    const { markets } = this.account;
    const baseAddress = base.address.toLowerCase();

    if (base.symbol === 'WETH') {
      return markets.find((_) => _.isEther);
    }

    return markets.find((_) => (
      _.underlying.address.toLowerCase() === baseAddress
    ));
  }

  public get quoteMarket() {
    const { quote } = this;
    const { markets } = this.account;
    const quoteAddress = quote.address.toLowerCase();

    if (quote.symbol === 'WETH') {
      return markets.find((_) => _.isEther);
    }

    return markets.find((_) => (
      _.underlying.address.toLowerCase() === quoteAddress
    ));
  }

  public get inRange() {
    const { tickCurrent } = this.uniswapPool;
    const { tickLower, tickUpper } = this.positionData;

    // check if price is within range
    const below = tickCurrent < tickLower;
    const above = tickCurrent >= tickUpper;
    const inRange = !below && !above;

    return inRange;
  }

  public get isClosed() {
    return this.positionData.liquidity.isZero();
  }

  public get amountBase() {
    return this.inverted ? this.amount0 : this.amount1;
  }

  public get amountQuote() {
    return this.inverted ? this.amount1 : this.amount0;
  }

  public get unclaimedAmountBase() {
    const value = this.inverted ? this.unclaimedAmount0 : this.unclaimedAmount1;
    return value && formatUnits(value, this.base.decimals);
  }

  public get unclaimedAmountQuote() {
    const value = this.inverted ? this.unclaimedAmount1 : this.unclaimedAmount0;
    return value && formatUnits(value, this.quote.decimals);
  }

  public get tokenBasePrice() {
    return this.inverted ? this.token0Price : this.token1Price;
  }

  public get tokenQuotePrice() {
    return this.inverted ? this.token1Price : this.token0Price;
  }

  public get liquidityBaseUsd() {
    return this.baseMarket
      ? this.baseMarket.price_usd * +this.amountBase
      : void 0;
  }

  public get liquidityQuoteUsd() {
    return this.quoteMarket
      ? this.quoteMarket.price_usd * +this.amountQuote
      : void 0;
  }

  public get liquidityUsd() {
    const { liquidityBaseUsd, liquidityQuoteUsd } = this;
    return liquidityBaseUsd !== void 0 && liquidityQuoteUsd !== void 0
      ? liquidityBaseUsd + liquidityQuoteUsd
      : void 0;
  }

  public get unclaimedBaseUsd() {
    return this.baseMarket && this.unclaimedAmountBase
      ? this.baseMarket.price_usd * +this.unclaimedAmountBase
      : void 0;
  }

  public get unclaimedQuoteUsd() {
    return this.quoteMarket && this.unclaimedAmountQuote
      ? this.quoteMarket.price_usd * +this.unclaimedAmountQuote
      : void 0;
  }

  public get unclaimedUsd() {
    const { unclaimedBaseUsd, unclaimedQuoteUsd } = this;
    return unclaimedBaseUsd !== void 0 && unclaimedQuoteUsd !== void 0
      ? unclaimedBaseUsd + unclaimedQuoteUsd
      : void 0;
  }
}
