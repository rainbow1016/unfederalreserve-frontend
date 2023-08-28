import trimEnd from 'lodash/trimEnd';

import { IEnv } from '@/global/env';
import { IAllMarket } from '@/types/api/allMarkets';
import { IAccountLiquidity, ILiquidationEvent } from '@/types/api/liquidity';
import { ITableHeader } from '@/components/UnTable/utils';

import { CURRENCIES } from '@/helpers/enums/currencies';
import { preciseRound, formatToCurrency, formatToFullDate } from '@/helpers/formatters';
import { formatSymbol } from '@/helpers/formatters/legacy';


// 0.222-e10 -> 0.0000222
const formatBalance = (number: number) => {
  if (!number) return '0';
  const isBig = number >= 1;

  const value = Intl.NumberFormat('en-US', {
    minimumFractionDigits: isBig ? 2 : 20,
    notation: isBig ? 'compact' : void 0,
  }).format(number);

  if (isBig && number === +value) return `${number}`;
  return isBig ? value : trimEnd(trimEnd(value, '0'), '.');
};

export enum LiquidatedTabs {
  at_risk = 'at_risk',
  liquidated = 'liquidated',
}

export const parseAccountLiquidity = (data?: IAccountLiquidity) => (data
  ? ({
    data,
    $id: [data.Address, data.Rate].join('-'),
    address: data.Address,
    loan_to_value: data.Rate > 200 ? '200%+' : `${preciseRound(data.Rate)}%`,
    usd_value: formatToCurrency(data.Data.SumBorrow / 1e18),
    status: 'At Risk',
  }) : ({
    data,
    $id: '',
    address: '',
    loan_to_value: '',
    usd_value: '',
    status: 'At Risk',
  })
);

export const parseAccountLiquidityBalances = (
  data: IAccountLiquidity,
  all_market: IAllMarket[],
) => {
  const list = data.Data.Balances.map((balance) => {
    const CToken = balance.CToken.toLowerCase();
    const { underlyingSymbol } = all_market.find((_) => (
      _.address.toLowerCase() === CToken
    )) || { underlyingSymbol: void 0 };

    return {
      symbol: underlyingSymbol,
      icon: underlyingSymbol && CURRENCIES[underlyingSymbol],
      supplied: formatBalance(balance.BalanceOfUnderlying),
      borrowed: formatBalance(balance.BorrowBalance),
      balance_of: formatBalance(balance.BalanceOf),
    };
  });

  return list;
};

export const AT_RISK_TABLE_HEADERS: ITableHeader<ReturnType<typeof parseAccountLiquidity>>[] = [
  {
    label: 'Address',
    key: 'address',
    left: true,
    class: 'is-liquidated-at-risk_address',
  },
  {
    label: 'Loan to Value',
    key: 'loan_to_value',
    right: true,
    class: 'is-liquidated-at-risk_loan-to-value',
  },
  {
    label: 'USD Value',
    key: 'usd_value',
    right: true,
    class: 'is-liquidated-at-risk_usd-value',
  },
  {
    label: 'Status',
    key: 'status',
    right: true,
    class: 'is-liquidated-at-risk_status',
  },
];

export const parseLiquidationEvent = (data?: ILiquidationEvent) => (data
  ? ({
    data,
    $id: [data.Borrower, data.Date, data.SeizeTokens].join('-'),
    address: data.Borrower,
    token: {
      name: data.Market.Symbol,
      symbol: formatSymbol(data.Market.Symbol),
      paused: false,
    },
    usd_value: formatToCurrency(+data.Market.Price * data.RepayAmount),
    status: 'Liquidated',
  })
  : ({
    data,
    $id: '',
    address: '',
    token: {
      name: '',
      symbol: '',
      paused: false,
    },
    usd_value: '',
    status: 'Liquidated',
  })
);

export const parseLiquidationEventExpanded = (
  data: ILiquidationEvent,
  env: IEnv,
) => ({
  list_top: [
    {
      label: 'Name',
      text: 'Liquidate Borrow',
    },
    {
      label: 'Topics',
      text: data.TxHash,
    },
  ],

  list_bottom: [
    {
      label: 'Date',
      text: formatToFullDate(data.Date),
    },
    {
      label: 'Liquidator',
      text: data.Liquidator,
      href: env.ADDRESS_URL && `${env.ADDRESS_URL}${data.Liquidator}`,
    },
    {
      label: 'Borrower',
      text: data.Borrower,
      href: env.ADDRESS_URL && `${env.ADDRESS_URL}${data.Borrower}`,
    },
    {
      label: 'RepayAmount',
      text: formatBalance(data.RepayAmount),
    },
    {
      label: 'cTokenCollateral',
      text: data.Collateral.Address,
      href: env.ADDRESS_URL && `${env.ADDRESS_URL}${data.Collateral.Address}`,
    },
    {
      label: 'seizeTokens',
      text: formatBalance(data.SeizeTokens),
    },
  ],
});

export const LIQUIDATED_TABLE_HEADERS: ITableHeader<ReturnType<typeof parseLiquidationEvent>>[] = [
  {
    label: 'Address',
    key: 'address',
    left: true,
    class: 'is-liquidated-liquidated_address',
  },
  {
    label: 'Token',
    key: 'token',
    right: true,
    class: 'is-liquidated-liquidated_token',
  },
  {
    label: 'USD Value',
    key: 'usd_value',
    right: true,
    class: 'is-liquidated-liquidated_usd-value',
  },
  {
    label: 'Status',
    key: 'status',
    right: true,
    class: 'is-liquidated-liquidated_status',
  },
];
