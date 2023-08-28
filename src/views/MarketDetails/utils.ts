import { IAllMarket } from '@/types/api/allMarkets';
import { calculateChangePercent } from '@/helpers/calculateChangePercent';
import { toFixed } from '@/helpers/toFixed';
import { formatSymbol } from '@/helpers/formatters/legacy';
import {
  formatPercentDisplay,
  beautifyNumber,
  formatToNumber,
  formatToCurrency,
} from '@/helpers/formatters';


const MIN_DISPLAY_PERCENT_VALUE = 0.001;

export const formatPercentage = (percent: number) => {
  if (+percent && Math.abs(+percent) < MIN_DISPLAY_PERCENT_VALUE) {
    return `< ${+percent < 0 ? '-' : ''}${MIN_DISPLAY_PERCENT_VALUE}%`;
  }
  if (percent > 0) {
    return `+${formatToNumber(percent)}%`;
  }
  return `${formatToNumber(percent)}%`;
};

const MARKET_DETAILS_BALANCES_MAP = {
  NET_RATE: {
    label: 'Net Rate',
    tooltipText: 'Current Net Rate and 24H change',
  },
  BORROW_APY: {
    label: 'Borrow APY',
    tooltipText: 'Current Borrow APY and 24H change',
  },
  DISTRIBUTION_APY: {
    label: 'Distribution APY',
    tooltipText: 'Current Distribution APY and 24H change',
  },
  TOTAL_BORROW: {
    label: 'Total Borrow',
    tooltipText: 'Current Total Borrow and 24H change',
  },
  SUPPLY_APY: {
    label: 'Supply APY',
    tooltipText: 'Current Supply APY and 24H change',
  },
  TOTAL_SUPPLY: {
    label: 'Total Supply',
    tooltipText: 'Current Total Supply and 24H change',
  },
};

export const getBalanceOptions = (data?: IAllMarket, isSupply = true) => {
  const daily_key = isSupply ? 'supplyDaily' : 'borrowDaily';
  const ago24h_key = isSupply ? 'supply24hAgo' : 'borrow24hAgo';

  const apyTitle = isSupply ? MARKET_DETAILS_BALANCES_MAP.SUPPLY_APY : MARKET_DETAILS_BALANCES_MAP.BORROW_APY;
  const totalTitle = isSupply ? MARKET_DETAILS_BALANCES_MAP.TOTAL_SUPPLY : MARKET_DETAILS_BALANCES_MAP.TOTAL_BORROW;

  if (!data) {
    return [
      {
        ...MARKET_DETAILS_BALANCES_MAP.NET_RATE,
        percent: '-',
        changes: '-',
        up: false,
        down: false,
      },
      {
        ...apyTitle,
        percent: '-',
        changes: '-',
        up: false,
        down: false,
      },
      {
        ...MARKET_DETAILS_BALANCES_MAP.DISTRIBUTION_APY,
        percent: '-',
        changes: '-',
        up: false,
        down: false,
      },
      {
        ...totalTitle,
        percent: '-',
        changes: '-',
        up: false,
        down: false,
      },
    ];
  }

  const [daily] = data[daily_key];
  const ago24h = data[ago24h_key];

  const totalValue = isSupply ? daily.total + data.reserves : daily.total;

  const apyChangePercent = calculateChangePercent(daily.apy, ago24h.apy);
  const totalChangePercent = calculateChangePercent(daily.total, ago24h.total);
  const apyChange = +toFixed(apyChangePercent, 3);
  const totalChange = +toFixed(totalChangePercent, 3);

  // TODO: add distribution
  const distributionDaily = 0;
  const distribution24h = 0;
  const distributionChangePercent = calculateChangePercent(distributionDaily, distribution24h);
  const distributionChange = +toFixed(distributionChangePercent, 3);

  const netDaily = isSupply ? daily.apy + distributionDaily : daily.apy - distributionDaily;
  const net24h = isSupply ? ago24h.apy + distribution24h : ago24h.apy - distribution24h;
  const netChangePercent = calculateChangePercent(netDaily, net24h);
  const netChange = +toFixed(netChangePercent, 3);

  return [
    {
      ...MARKET_DETAILS_BALANCES_MAP.NET_RATE,
      percent: formatPercentDisplay(netDaily),
      changes: formatPercentage(netChange),
      up: netChange > 0,
      down: netChange < 0,
    },
    {
      ...apyTitle,
      percent: formatPercentDisplay(daily.apy),
      changes: formatPercentage(apyChange),
      up: apyChange > 0,
      down: apyChange < 0,
    },
    {
      ...MARKET_DETAILS_BALANCES_MAP.DISTRIBUTION_APY,
      percent: '-',
      changes: '-',
      up: distributionChange > 0,
      down: distributionChange < 0,
    },
    {
      ...totalTitle,
      percent: beautifyNumber(totalValue, true),
      changes: formatPercentage(totalChange),
      up: totalChange > 0,
      down: totalChange < 0,
    },
  ];
};

export const getDetailsList = (data?: IAllMarket) => [
  {
    title: 'Price',
    value: data && formatToCurrency(data.price),
  },
  {
    title: 'Market Liquidity',
    value: data && [
      formatToNumber(data.liquidity),
      formatSymbol(data.underlyingSymbol),
    ].join(' '),
  },
  {
    title: '# of Suppliers',
    value: data?.numSuppliers,
  },
  {
    title: '# of Borrowers',
    value: data?.numBorrowers,
  },
  {
    title: 'Reserves',
    value: data && [
      formatToNumber(data.reserves),
      formatSymbol(data.underlyingSymbol, true),
    ].join(' '),
  },
  {
    title: 'Reserve Factor',
    value: data && formatPercentDisplay(100 * data.reserveFactor),
  },
  {
    title: 'Collateral Factor',
    value: data && formatPercentDisplay(100 * data.collateralFactor),
  },
  {
    title: data && `${formatSymbol(data.symbol)} Minted`,
    value: data && formatToNumber(data.minted),
  },
  {
    title: 'Exchange Rate',
    value: data && [
      `1 ${formatSymbol(data.underlyingSymbol, true)} = `,
      formatToNumber(data.exchangeRate),
      formatSymbol(data.symbol),
    ].join(' '),
  },
];
