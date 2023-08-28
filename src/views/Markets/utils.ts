import { RouteLocationRaw } from 'vue-router';
import { IAllMarket } from '@/types/api/allMarkets';
import { toFixed } from '@/helpers/toFixed';
import { ROUTE_MARKET_DETAILS } from '@/helpers/enums/routes';
import { calculateChangePercent } from '@/helpers/calculateChangePercent';
import { formatToNumber } from '@/helpers/formatters';
import { ITableHeader } from '@/components/UnTable/utils';


export enum MarketTotalTypes {
  supply = 'supply',
  borrow = 'borrow',
}

export const enum MarketTableKeys {
  market = 'market',

  supply_total = 'supply_total',
  supply_total_changes = 'supply_total_changes',

  supply_apy = 'supply_apy',
  supply_apy_changes = 'supply_apy_changes',

  borrow_total = 'borrow_total',
  borrow_total_changes = 'borrow_total_changes',

  borrow_apy = 'borrow_apy',
  borrow_apy_changes = 'borrow_apy_changes',
}

export const getMarketsTotal = (
  markets: IAllMarket[],
  key: 'supplyDaily' | 'borrowDaily',
) => (
  markets.reduce((acc, market) => {
    const [now] = market[key] || [];
    return acc + (now.total || 0);
  }, 0)
);

export const getMarketsDaily = (
  markets: IAllMarket[],
  key: 'supplyDaily' | 'borrowDaily',
) => {
  const key24h = key === 'supplyDaily' ? 'supply24hAgo' : 'borrow24hAgo';

  return markets.reduce((acc, market) => {
    const [now] = market[key] || [];
    return acc + (now.total || 0) - (market[key24h].total || 0);
  }, 0);
};

export const getMarketsCount = (
  markets: IAllMarket[],
  key: 'numSuppliers' | 'numBorrowers',
) => (
  markets.reduce((acc, market) => (
    acc + (market[key] || 0)
  ), 0)
);

export const MARKETS_TABLE_HEADERS: ITableHeader[] = [
  {
    label: 'Market',
    key: MarketTableKeys.market,
    left: true,
    class: 'markets-all-table__col-first',
  },
  {
    label: 'Total Supply',
    key: MarketTableKeys.supply_total,
    right: true,
    class: 'markets-all-table__col-second',
    tooltipText: 'Current Total Supply and 24H change',
  },
  {
    label: 'Supply APY',
    key: MarketTableKeys.supply_apy,
    right: true,
    class: 'markets-all-table__col',
    tooltipText: 'Current Supply APY and 24H change',
  },
  {
    label: 'Total Borrow',
    key: MarketTableKeys.borrow_total,
    right: true,
    class: 'markets-all-table__col',
    tooltipText: 'Current Total Borrow and 24H change',
  },
  {
    label: 'Borrow APY',
    key: MarketTableKeys.borrow_apy,
    right: true,
    class: 'markets-all-table__col',
    tooltipText: 'Current Borrow APY and 24H change',
  },
];


export const MARKETS_TABLE_SLOTS = [
  {
    key: `col-${MarketTableKeys.supply_total}`,
    value: MarketTableKeys.supply_total,
    changes: MarketTableKeys.supply_total_changes,
    percent: false,
    title: 'Total Supply',
  },
  {
    key: `col-${MarketTableKeys.supply_apy}`,
    value: MarketTableKeys.supply_apy,
    changes: MarketTableKeys.supply_apy_changes,
    percent: true,
    title: 'Supply APY',
  },
  {
    key: `col-${MarketTableKeys.borrow_total}`,
    value: MarketTableKeys.borrow_total,
    changes: MarketTableKeys.borrow_total_changes,
    percent: false,
    title: 'Total Borrow',
  },
  {
    key: `col-${MarketTableKeys.borrow_apy}`,
    value: MarketTableKeys.borrow_apy,
    changes: MarketTableKeys.borrow_apy_changes,
    percent: true,
    title: 'Borrow APY',
  },
];

const calculateChangeAllMarkets = (
  market: IAllMarket,
  type: MarketTotalTypes,
  key: 'total' | 'apy',
) => {
  const key_daily = `${type}Daily` as const;
  const key_24h = `${type}24hAgo` as const;

  const [now] = market[key_daily];
  const ago24 = market[key_24h];

  return calculateChangePercent(now[key], ago24[key]);
};

const calculateChangeAllMarketsToFixed = (
  market: IAllMarket,
  type: MarketTotalTypes,
  key: 'total' | 'apy',
) => {
  const changes = calculateChangeAllMarkets(market, type, key);

  return +toFixed(changes, 3);
};


export type IAllMarketsData = ReturnType<typeof createAllMarketsData>;

export const disabledText = (market: IAllMarket) => {
  const isSupplyAllowed = !market.mintGuardianPaused;
  const isBorrowAllowed = !market.borrowGuardianPaused;

  if (!isSupplyAllowed && !isBorrowAllowed) {
    return 'Supply & Borrow Disabled';
  }

  if (!isSupplyAllowed && isBorrowAllowed) {
    return 'Supply Disabled';
  }

  if (isSupplyAllowed && !isBorrowAllowed) {
    return 'Borrow Disabled';
  }

  return '';
};

export const createAllMarketsData = (market?: IAllMarket) => {
  if (!market) {
    return {
      address: '',
      name: '',
      symbol: '',
      isBorrowAllowed: true,
      isSupplyAllowed: true,
      isListed: true,
      disabledText: '',

      [MarketTableKeys.supply_total]: 0,
      [MarketTableKeys.supply_total_changes]: 0,

      [MarketTableKeys.supply_apy]: 0,
      [MarketTableKeys.supply_apy_changes]: 0,

      [MarketTableKeys.borrow_total]: 0,
      [MarketTableKeys.borrow_total_changes]: 0,

      [MarketTableKeys.borrow_apy]: 0,
      [MarketTableKeys.borrow_apy_changes]: 0,
    };
  }

  const supplyTotalChange = calculateChangeAllMarketsToFixed(market, MarketTotalTypes.supply, 'total');
  const supplyApyChange = calculateChangeAllMarketsToFixed(market, MarketTotalTypes.supply, 'apy');

  const borrowTotalChange = calculateChangeAllMarketsToFixed(market, MarketTotalTypes.borrow, 'total');
  const borrowApyChange = calculateChangeAllMarketsToFixed(market, MarketTotalTypes.borrow, 'apy');

  return {
    address: market.address,
    name: market.name.replace('unFederal ', ''),
    symbol: market.underlyingSymbol,
    isBorrowAllowed: !market.borrowGuardianPaused,
    isSupplyAllowed: !market.mintGuardianPaused,
    isListed: market.isListed,
    disabledText: disabledText(market),

    [MarketTableKeys.supply_total]: market.supplyDaily[0].total + market.reserves,
    [MarketTableKeys.supply_total_changes]: supplyTotalChange,

    [MarketTableKeys.supply_apy]: market.supplyDaily[0].apy || 0,
    [MarketTableKeys.supply_apy_changes]: supplyApyChange,

    [MarketTableKeys.borrow_total]: market.borrowDaily[0].total,
    [MarketTableKeys.borrow_total_changes]: borrowTotalChange,

    [MarketTableKeys.borrow_apy]: market.borrowDaily[0].apy,
    [MarketTableKeys.borrow_apy_changes]: borrowApyChange,
  };
};

export const getAllMarketsRowLocation = (
  data?: IAllMarketsData,
): RouteLocationRaw | undefined => data && ({
  name: ROUTE_MARKET_DETAILS,
  params: { symbol: data.symbol || 'UNKNOWN' },
});

export const formatPercentage = (percent: number) => {
  if (Math.abs(percent) < 0.001) {
    return '0%';
  }
  if (percent > 0) {
    return `+${formatToNumber(percent)}%`;
  }
  return `${formatToNumber(percent)}%`;
};
