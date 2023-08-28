import { Market } from '@/types/common.d';
import { ITableHeader } from '@/components/UnTable/utils';
import {
  formatToCurrencyDisplay,
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

export const USER_SUPPLY_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.supply_allowed,
      tooltipPaused: SUPPLY_IS_PAUSED,
    }),
    left: true,
    class: 'is-user-supply_asset',
  },
  {
    label: 'APY ',
    key: 'apy',
    field: (_, data) => {
      if (!data) return '-';

      const usd = formatPercentDisplay(data.supply_apy);
      return usd;
    },
    right: true,
    class: 'is-user-supply_apy_earned',
  },
  {
    label: 'Balance',
    key: 'balance',
    field: (_, data) => {
      if (!data) return {};

      const usd = formatToCurrencyDisplay(data.fiat_supply);
      return { usd };
    },
    right: true,
    class: 'is-user-supply_supply_balance',
  },
  {
    label: 'Earned',
    key: 'apy_earned',
    field: (_, data) => {
      if (!data) return {};

      const usd = formatToCurrencyDisplay(data.earned.usd);
      return { usd };
    },
    right: true,
    class: 'is-user-supply_apy_earned',
  },
];


const BORROW_IS_PAUSED = [
  '<b>Borrow is paused</b>',
  'Borrow of an asset is no longer available. Make sure to repay your borrow before liquidation.',
].join('<br>');

export const USER_BORROWINGS_TABLE_HEADERS: ITableHeader<IMarketSignature>[] = [
  {
    label: 'Asset',
    key: 'asset',
    field: (_, data) => data && ({
      symbol: formatSymbol(data.symbol),
      paused: !data.borrow_allowed,
      tooltipPaused: BORROW_IS_PAUSED,
    }),
    left: true,
    class: 'is-user-borrow_asset',
  },
  {
    label: 'APY',
    key: 'apy_accrued',
    field: (_, data) => data && (
      formatPercentDisplay(data.borrow_apy)
    ),
    right: true,
    class: 'is-user-borrow_apy_accrued',
  },
  {
    label: 'Balance',
    key: 'balance',
    field: (_, data) => {
      if (!data) return {};

      const usd = formatToCurrencyDisplay(data.fiat_borrow);
      return { usd };
    },
    right: true,
    class: 'is-user-borrow_borrow_balance',
  },
  {
    label: '% of limit',
    key: 'percent_of_limit',
    field: (_, data) => {
      if (!data) return '-';

      const value = (100 * data.fiat_borrow) / data.account.borrow_limit;
      return formatPercentDisplay(value);
    },
    right: true,
    class: 'is-user-borrow_percent_of_limit',
  },
];

export const USER_SUPPLY_TABLE_SETTINGS = {
  type: HomeTableTypes.supply_user,
  title: 'My Supply'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: USER_SUPPLY_TABLE_HEADERS,
  empty_title: 'No assets supplied',
  empty_description: 'Choose an asset to supply from the lend page',
  testid: 'my-supply',
};

export const USER_BORROWINGS_TABLE_SETTINGS = {
  type: HomeTableTypes.borrow_user,
  title: 'My Borrowings'.replace(/\s/g, NON_BREAKING_SPACE),
  headers: USER_BORROWINGS_TABLE_HEADERS,
  empty_title: 'No assets borrowed',
  empty_description: 'Supply an asset and enable collateral to allow borrowing',
  testid: 'my-borrowings',
};
