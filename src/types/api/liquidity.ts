export interface IAccountLiquidityDataBalance {
  BalanceOf: number;
  BalanceOfUnderlying: number;
  BorrowBalance: number;
  BorrowValue: number;
  CToken: string;
  CollateralFactor: number;
  CollateralValue: number;
}

export interface IAccountLiquidity {
  Address: string;
  Data: {
    Balances: IAccountLiquidityDataBalance[];
    SumBorrow: number;
    SumCollateral: number;
  };
  Rate: number;
}

interface ILiquidationEventMarket {
  Address: string;
  Ctoken: string;
  Price: string;
  Symbol: string;
}

export interface ILiquidationEvent {
  Borrower: string;
  Collateral: ILiquidationEventMarket;
  Date: string;
  Liquidator: string;
  Market: ILiquidationEventMarket;
  RepayAmount: number;
  SeizeTokens: number;
  TxHash: string;
}
