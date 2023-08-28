export interface IAllMarketDaily {
  apy: number;
  block: number;
  time: string;
  total: number;
}

export interface IAllMarket24Ago extends IAllMarketDaily {
}


type ISymbol =
| 'AAVE' | 'BAT' | 'BUSD' | 'CREAM' | 'DPI' | 'FTT' | 'HUSD' | 'MTA' | 'SRM' | 'UNI' | 'WBTC' | 'yETH'
| 'ZRX' | 'BAL' | 'BBTC' | 'CEL' | 'CRETH2' | 'eRSDL' | 'HBTC' | 'KP3R' | 'renBTC' | 'SUSHI' | 'USDC' | 'WNXM'
| 'YFI' | 'BOND' | 'COMP' | 'DAI' | 'ETH' | 'HFIL' | 'LINK' | 'REP' | 'SWAG' | 'USDT' | 'yCRV' | 'yUSD'

export interface IAllMarket {
  address: string;

  numBorrowers?: number;
  borrow24hAgo: IAllMarket24Ago;
  borrowDaily: IAllMarketDaily[];
  borrows: number;
  borrowGuardianPaused: boolean;
  mintGuardianPaused: boolean;

  cTokenDecimals: number;
  collateralFactor: number;
  exchangeRate: number;
  isListed: boolean;
  liquidity: number;
  minted: number;
  name: string;
  price: number;
  reserveFactor: number;
  reserves: number;
  symbol: `un${ISymbol}`;

  numSuppliers?: number;
  supply24hAgo: IAllMarket24Ago;
  supplyDaily: IAllMarketDaily[];

  underlying: number;
  underlyingDecimals: number;
  underlyingSymbol: ISymbol;
}

export interface IAllMarketLight {
  address: string;
  borrowApy: number;
  supplyApy: number;
}
