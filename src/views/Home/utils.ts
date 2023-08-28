import { Market } from '@/types/common.d';
import { ITableHeader } from '@/components/UnTable/utils';
import {
  beautifyNumber,
  formatToCurrencyDisplay,
  formatBalanceDisplay,
  formatPercentDisplay,
} from '@/helpers/formatters';
import { NON_BREAKING_SPACE } from '@/helpers/enums/params';
import { formatSymbol } from '@/helpers/formatters/legacy';


export const enum HomeTableTypes {
  supply_all = 'supply_all',
  supply_user = 'supply_user',
  borrow_all = 'borrow_all',
  borrow_user = 'borrow_user',
}

type IMarketSignature = Market | undefined;


const SUPPLY_IS_PAUSED = [
  '<b>Supply is paused</b>',
  'Supply of an asset is no longer available. You can withdraw at any time',
].join('<br>');

const BORROW_IS_PAUSED = [
  '<b>Borrow is paused</b>',
  'Borrow of an asset is no longer available. Make sure to repay your borrow before liquidation.',
].join('<br>');


export const USER_SUPPLY_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.supply_allowed,
      tooltipPaused: SUPPLY_IS_PAUSED,
      loading: data.loading,
    }),
    left: true,
    class: 'is-user-supply_asset',
  },
  {
    label: 'APY / Earned',
    key: 'apy_earned',
    field: (_, data) => {
      if (!data) return {};

      const usd = formatPercentDisplay(data.supply_apy);
      const value = formatToCurrencyDisplay(data.earned.usd);

      const tooltipValue = [
        `<nobr>Earned: <b>${data.earned.usd}</b></nobr>`,
      ].join('<br>');

      return { usd, tooltipValue, value };
    },
    right: true,
    tooltipText: 'Estimated interest earned on supplied Asset',
    class: 'is-user-supply_apy_earned',
  },
  {
    label: 'Balance',
    key: 'balance',
    field: (_, data) => {
      if (!data) return {};

      const usd = formatToCurrencyDisplay(data.fiat_supply);

      const value = [
        formatBalanceDisplay(data.supply_balance),
        formatSymbol(data.symbol, true),
      ].join(' ');

      const usd_balance = formatToCurrencyDisplay(data.fiat_supply);

      const tooltipUsd = [
        `<nobr>USD Balance: <b>${usd_balance}</b></nobr>`,
        `<nobr>Balance: <b>${data.supply_balance}</b></nobr>`,
      ].join('<br>');

      // eslint-disable-next-line object-curly-newline
      return { usd, tooltipUsd, value, green: true };
    },
    right: true,
    tooltipText: 'Total value of supplied assets',
    class: 'is-user-supply_supply_balance',
  },
  {
    label: 'Collateral',
    key: 'collateral',
    field: (_, data) => data && ({
      value: data.isEnteredTheMarket,
      disabled: (
        !data.isEnteredTheMarket
         // eslint-disable-next-line no-underscore-dangle
         && data._tokenMetadata.collateralFactorMantissa.isZero()
      ),
    }),
    right: true,
    tooltipText: 'Use an Asset towards your borrowing limit',
    class: 'is-user-supply_collateral',
  },
];

export const ALL_SUPPLY_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: '',
    key: 'plus_btn',
    left: true,
    class: 'is-all-supply_plus_btn',
  },
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.supply_allowed,
      tooltipPaused: SUPPLY_IS_PAUSED,
      loading: data.loading,
    }),
    left: true,
    class: 'is-all-supply_asset',
  },
  {
    label: 'APY',
    key: 'supply_apy',
    field: (_, data) => (
      data && formatPercentDisplay(data.supply_apy)
    ),
    right: true,
    tooltipText: 'Estimated interest earned on supplied Asset',
    class: 'is-all-supply_supply_apy',
  },
  {
    label: 'Wallet',
    key: 'wallet',
    field: (_, data) => {
      if (!data) return '';
      const apy = formatBalanceDisplay(data.balance);
      return `${apy} ${formatSymbol(data.symbol)}`;
    },
    right: true,
    tooltipText: 'Balance available for Supply',
    class: 'is-all-supply_wallet',
  },
  {
    label: '',
    key: 'menu',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      unSymbol: formatSymbol(data.cSymbol),
      market: data,
    }),
    right: true,
    class: 'is-all-supply_menu',
  },
];

export const USER_BORROWINGS_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.borrow_allowed,
      tooltipPaused: BORROW_IS_PAUSED,
      loading: data.loading,
    }),
    left: true,
    class: 'is-user-borrow_asset',
  },
  {
    label: 'APY',
    key: 'apy_accrued',
    field: (_, data) => (
      data && formatPercentDisplay(data.borrow_apy)
    ),
    right: true,
    tooltipText: 'Estimated interest paid on borrowed Asset',
    class: 'is-user-borrow_apy_accrued',
  },
  {
    label: 'Balance',
    key: 'balance',
    field: (_, data) => {
      if (!data) return {};

      const usd = `${formatToCurrencyDisplay(data.fiat_borrow)}`;

      const value = [
        formatBalanceDisplay(data.borrow_balance),
        formatSymbol(data.symbol, true),
      ].join(' ');

      const usd_balance = formatToCurrencyDisplay(data.fiat_borrow);

      const tooltipUsd = [
        `<nobr>USD Balance: <b>${usd_balance}</b></nobr>`,
        `<nobr>Balance: <b>${data.borrow_balance}</b></nobr>`,
      ].join('<br>');

      // eslint-disable-next-line object-curly-newline
      return { usd, tooltipUsd, value, green: true };
    },
    right: true,
    tooltipText: 'Total value of borrowed assets',
    class: 'is-user-borrow_borrow_balance',
  },
  {
    label: '% of limit',
    key: 'percent_of_limit',
    field: (_, data) => {
      if (!data) return void 0;

      const value = (100 * data.fiat_borrow) / data.account.borrow_limit;
      return formatPercentDisplay(value);
    },
    right: true,
    tooltipText: 'Percentage of borrow used against supplied assets',
    class: 'is-user-borrow_percent_of_limit',
  },
];

export const ALL_BORROW_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: '',
    key: 'plus_btn',
    left: true,
    class: 'is-all-borrow_plus_btn',
  },
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.borrow_allowed,
      tooltipPaused: BORROW_IS_PAUSED,
      loading: data.loading,
    }),
    left: true,
    class: 'is-all-borrow_asset',
  },
  {
    label: 'APY',
    key: 'borrow_apy',
    field: (_, data) => (
      data && formatPercentDisplay(data.borrow_apy)
    ),
    right: true,
    tooltipText: 'Estimated interest paid on borrowed Asset',
    class: 'is-all-borrow_borrow_apy',
  },
  {
    label: 'Available',
    key: 'tokens_available_usd',
    field: (_, data) => {
      if (!data) return void 0;
      const usd = formatBalanceDisplay(data.tokens_available_usd);
      return `${usd} ${formatSymbol(data.symbol)}`;
    },
    right: true,
    tooltipText: 'Balance available for Borrow',
    class: 'is-all-borrow_available',
  },
  {
    label: 'Liquidity',
    key: 'liquidity',
    field: (_, data) => (
      data && beautifyNumber(data.liquidity_usd, true)
    ),
    right: true,
    tooltipText: 'Balance equivalent available for Borrow (in USD)',
    class: 'is-all-borrow_liquidity',
  },
];


export const USER_SUPPLY_TABLE_SETTINGS = {
  type: HomeTableTypes.supply_user,
  title: 'My Supply'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: USER_SUPPLY_TABLE_HEADERS,
  empty_title: 'No assets supplied',
  empty_description: 'Choose an asset to supply from the table below',
  testid: 'my-supply',
};

export const ALL_SUPPLY_TABLE_SETTINGS = {
  type: HomeTableTypes.supply_all,
  title: 'All Supply Markets'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: ALL_SUPPLY_TABLE_HEADERS,
  empty_title: 'All assets supplied',
  empty_description: 'Choose an asset to withdraw from the table above',
  testid: 'supply-markets',
};

export const USER_BORROWINGS_TABLE_SETTINGS = {
  type: HomeTableTypes.borrow_user,
  title: 'My Borrowings'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: USER_BORROWINGS_TABLE_HEADERS,
  empty_title: 'No assets borrowed',
  empty_description: 'Supply an asset and enable collateral to allow borrowing',
  testid: 'my-borrowings',
};

export const ALL_BORROW_TABLE_SETTINGS = {
  type: HomeTableTypes.borrow_all,
  title: 'All Borrow Markets'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: ALL_BORROW_TABLE_HEADERS,
  empty_title: 'All assets borrowed',
  empty_description: 'Choose an asset to repay from the table above',
  testid: 'borrow-markets',
};
