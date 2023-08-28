import { utils } from 'ethers';

import { Account, Market } from '@/types/common.d';
import { MIN_USD_BALANCE } from '@/helpers/enums/params';
// eslint-disable-next-line object-curly-newline
import { formatToNumber, formatToCurrency, convertToUsd, formatPercentDisplay } from '@/helpers/formatters';
import { toFixed } from '@/helpers/toFixed';
import { formatUnits } from '@/helpers/formatUnits';

import { TransactionTypes } from './utils-common';

const getValueUsd = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const valueUsd = convertToUsd(
    value,
    // eslint-disable-next-line no-underscore-dangle
    market._underlyingPrice,
    // eslint-disable-next-line no-underscore-dangle
    market._tokenMetadata.underlyingDecimals,
  );

  switch (type) {
    case TransactionTypes.collateral:
    case TransactionTypes.supply:
    case TransactionTypes.withdraw: {
      const collateralFactorMantissaUnits = formatUnits(
        // eslint-disable-next-line no-underscore-dangle
        market._tokenMetadata.collateralFactorMantissa,
      );

      return valueUsd * +collateralFactorMantissaUnits;
    }

    case TransactionTypes.borrow:
    case TransactionTypes.repay: {
      return valueUsd;
    }

    default:
      return 0;
  }
};

const getTotalBorrow = (
  type: TransactionTypes,
  market: Market,
) => {
  switch (type) {
    case TransactionTypes.supply:
    case TransactionTypes.withdraw:
      // eslint-disable-next-line no-underscore-dangle
      return +utils.formatEther(market._totalBorrows); // TODO: formaUnits

    case TransactionTypes.borrow:
    case TransactionTypes.repay:
      return market.account.total_borrow;

    default:
      return 0;
  }
};

const getBorrowBalance = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const { account } = market;
  const valueUsd = getValueUsd(type, market, value);
  const borrowBalanceUsd = getValueUsd(type, market, market.borrow_balance);

  switch (type) {
    case TransactionTypes.supply:
    case TransactionTypes.withdraw:
      return borrowBalanceUsd; // unreachable code !!!

    case TransactionTypes.borrow: {
      if (!+value) return account.total_borrow;
      const borrowBalance = account.total_borrow + valueUsd;
      return account.borrow_limit < borrowBalance
        ? account.borrow_limit
        : borrowBalance;
    }

    case TransactionTypes.repay:
      if (!+value) return account.total_borrow;
      return borrowBalanceUsd < valueUsd
        ? account.total_borrow - borrowBalanceUsd
        : account.total_borrow - valueUsd;

    default:
      return 0;
  }
};

const getBorrowLimit = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const { total_borrow, borrow_limit } = market.account;
  const valueUsd = getValueUsd(type, market, value);
  const balanceUsd = getValueUsd(type, market, market.balance);
  const supplyBalanceUsd = getValueUsd(type, market, market.supply_balance);

  let borrowLimit = borrow_limit;

  switch (type) {
    case TransactionTypes.collateral:
      borrowLimit = market.isEnteredTheMarket
        ? borrow_limit - valueUsd
        : borrow_limit + valueUsd;
      break;

    case TransactionTypes.supply:
      if (market.isEnteredTheMarket) {
        borrowLimit = valueUsd > balanceUsd
          ? borrow_limit + balanceUsd
          : borrow_limit + valueUsd;
      } else {
        borrowLimit = borrow_limit;
      }
      break;

    case TransactionTypes.withdraw:
      if (market.isEnteredTheMarket) {
        borrowLimit = valueUsd > supplyBalanceUsd
          ? borrow_limit - supplyBalanceUsd
          : borrow_limit - valueUsd;
      } else {
        borrowLimit = borrow_limit;
      }
      break;

    case TransactionTypes.borrow:
      borrowLimit = total_borrow + valueUsd;
      break;

    case TransactionTypes.repay:
      borrowLimit = total_borrow - valueUsd;
      break;

    default:
      borrowLimit = 0;
  }

  // для сглаживания неточности
  return Math.abs(borrowLimit) < 0.001 ? 0 : borrowLimit;
};

const getBorrowLimitUsed = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const { borrow_limit, total_borrow } = market.account;

  const totalBorrowsUnits = +formatUnits(
    // eslint-disable-next-line no-underscore-dangle
    market._totalBorrows,
    // eslint-disable-next-line no-underscore-dangle
    market._tokenMetadata.underlyingDecimals,
  );

  const isZeroBorrow = (
    totalBorrowsUnits === 0
    || totalBorrowsUnits < MIN_USD_BALANCE
  );

  switch (type) {
    case TransactionTypes.collateral: {
      // if (market.supply_balance === value) return 0;
      // if (+market.supply_balance - +value < 0) return 100;
      const newBorrowLimit = getBorrowLimit(type, market, value);
      const limit = (total_borrow / newBorrowLimit) * 100;
      return limit > 100 ? 'Liquidation' : +toFixed(limit, 2);
    }

    case TransactionTypes.supply:
    case TransactionTypes.withdraw: {
      if (isZeroBorrow) return 0;
      // if (!market.isEnteredTheMarket) return borrow_limit;
      const newBorrowLimit = getBorrowLimit(type, market, value);
      if (newBorrowLimit < 0) return 100;
      if (newBorrowLimit === 0) return 0;
      const limit = (total_borrow / newBorrowLimit) * 100;
      return limit > 100 ? 100 : +toFixed(limit, 2);
    }

    case TransactionTypes.borrow:
    case TransactionTypes.repay: {
      if (!borrow_limit) return 0;
      const borrowBalance = getBorrowBalance(type, market, value);
      const limit = (borrowBalance / borrow_limit) * 100;

      return limit > 100 ? 100 : +toFixed(limit, 2);
    }

    default:
      return 0;
  }
};


//


const createSupplyRates = (
  market: Market,
) => {
  const from1 = market.supply_apy;
  const from1_f = formatPercentDisplay(from1);

  const from2 = market.supply_distribution_apy;
  const from2_f = formatPercentDisplay(from2);

  return {
    title: 'Supply rates',
    list: [
      {
        icon: market.symbol,
        name: 'Supply APY',
        from: from1,
        from_f: from1_f,
        to: void 0,
        to_f: '',
        tooltipText: 'Estimated interest earned on supplied Asset',
      },
      {
        icon: 'base',
        name: 'Distribution APY',
        from: from2,
        from_f: from2_f,
        to: void 0,
        to_f: '',
        tooltipText: 'Earning rate for eRSDL rewards',
      },
    ],
  };
};

const createSupplyBorrowLimit = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const { borrow_limit, borrow_limit_used } = market.account;

  const newBorrowLimit = getBorrowLimit(type, market, value);
  const newBorrowLimitUsed = getBorrowLimitUsed(type, market, value);

  const from1 = borrow_limit;
  const from1_f = formatToCurrency(from1);

  const to1 = newBorrowLimit;
  const compact1 = !!from1 && Math.abs(to1 / from1) > 100;
  const to1_f = formatToCurrency(to1, void 0, compact1);

  const from2 = borrow_limit_used;
  const from2_f = formatPercentDisplay(from2);

  const to2 = newBorrowLimitUsed;
  const to2_f = typeof to2 === 'string'
    ? to2
    : formatPercentDisplay(to2);

  return {
    title: 'Borrow limit',
    hypothetical_borrow_limit: newBorrowLimit,
    hypothetical_borrow_limit_used: newBorrowLimitUsed,
    list: [
      {
        name: 'Borrow Limit',
        from: from1,
        to: from1_f === to1_f ? void 0 : to1,
        from_f: from1_f,
        to_f: from1_f === to1_f ? void 0 : to1_f,
        tooltipText: 'Total value of borrowed assets',
        warning: false,
      },
      {
        name: 'Borrow Limit Used',
        from: from2,
        to: from2_f === to2_f ? void 0 : to2,
        from_f: from2_f,
        to_f: from2_f === to2_f ? void 0 : to2_f,
        tooltipText: 'Percentage of borrow used against supplied assets',
        warning: true,
      },
    ],
  };
};

const createBorrowRates = (
  market: Market,
) => {
  const from1 = market.borrow_apy;
  const from1_f = formatPercentDisplay(from1);

  const from2 = market.borrow_distribution_apy;
  const from2_f = formatPercentDisplay(from2);

  return {
    title: 'Borrow rates',
    list: [
      {
        icon: market.symbol,
        name: 'Borrow APY',
        from: from1,
        from_f: from1_f,
        to: void 0,
        tooltipText: 'Estimated interest paid on borrowed Asset',
      },
      {
        icon: 'base',
        name: 'Distribution APY',
        from: from2,
        from_f: from2_f,
        to: void 0,
        tooltipText: 'Earning rate for eRSDL rewards',
      },
    ],
  };
};

const createBorrowBorrowLimit = (
  type: TransactionTypes,
  market: Market,
  value: string,
) => {
  const { borrow_limit_used } = market.account;

  const totalBorrow = getTotalBorrow(type, market);
  const borrowBalance = getBorrowBalance(type, market, value);

  const newBorrowLimit = getBorrowLimit(type, market, value);
  const newBorrowLimitUsed = getBorrowLimitUsed(type, market, value);

  const from1 = totalBorrow;
  const from1_f = formatToCurrency(from1);

  const to1 = borrowBalance;
  const to1_f = formatToCurrency(to1, void 0, !!from1 && Math.abs(to1 / from1) > 100);

  const from2 = borrow_limit_used;
  const from2_f = formatPercentDisplay(from2);

  const to2 = newBorrowLimitUsed;
  const to2_f = typeof to2 === 'string'
    ? to2
    : formatPercentDisplay(to2);

  return {
    title: 'Borrow limit',
    hypothetical_borrow_limit: newBorrowLimit,
    hypothetical_borrow_limit_used: newBorrowLimitUsed,
    list: [
      {
        name: 'Borrow Balance',
        from: from1,
        to: from1_f === to1_f ? void 0 : to1,
        from_f: from1_f,
        to_f: from1_f === to1_f ? void 0 : to1_f,
        tooltipText: 'Total value of borrowed assets',
        warning: false,
      },
      {
        name: 'Borrow Limit Used',
        from: from2,
        to: from2_f === to2_f ? void 0 : to2,
        from_f: from2_f,
        to_f: from2_f === to2_f ? void 0 : to2_f,
        tooltipText: 'Percentage of borrow used against supplied assets',
        warning: true,
      },
    ],
  };
};


export const createClaimRewardsLimits = (
  account: Account,
) => {
  const { eRSDL, unclaimed_rewards } = account;
  const settings = account.wallet.current_provider_settings;
  const walletLogo = settings ? settings.logo : '';

  const from1 = eRSDL.balance;
  const from1_f = `${formatToNumber(from1)} eRSDL`;

  const from2 = +unclaimed_rewards;
  const from2_f = from2 ? `+${formatToNumber(from2)}` : from2;

  return {
    title: '',
    list: [
      {
        name: 'Wallet balance',
        from: from1,
        from_f: from1_f,
        icon: walletLogo,

        // TODO: for ts
        to: void 0,
        to_f: '',
        tooltipText: '',
      },
      {
        name: 'Unclaimed balance',
        from: from2,
        from_f: from2_f,
        color: '#00D395',

        // TODO: for ts
        icon: '',
        to: void 0,
        to_f: '',
        tooltipText: '',
      },
    ],
  };
};


//

export type ITransactionLimit = ITransactionLimitsList[number]['list'][number] & {
  icon?: string;
  iconRight?: string;
  color?: string;
  to?: number;
  to_f?: string;
  tooltipText?: string;
};

type ITransactionLimitsList =
  | readonly [
    ReturnType<typeof createSupplyRates>,
  ]
  | readonly [
    ReturnType<typeof createSupplyBorrowLimit>,
  ]
  | readonly [
    ReturnType<typeof createSupplyRates>,
    ReturnType<typeof createSupplyBorrowLimit>,
  ]
  | readonly [
    ReturnType<typeof createBorrowRates>,
    ReturnType<typeof createBorrowBorrowLimit>,
  ];

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes.approve,
  value: string,
): readonly [
  ReturnType<typeof createSupplyRates>,
];

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes.collateral,
  value: string,
): readonly [
  ReturnType<typeof createSupplyBorrowLimit>,
];

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes.supply | TransactionTypes.withdraw,
  value: string,
): readonly [
  ReturnType<typeof createSupplyRates>,
  ReturnType<typeof createSupplyBorrowLimit>,
];

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes.borrow | TransactionTypes.repay,
  value: string,
): readonly [
  ReturnType<typeof createBorrowRates>,
  ReturnType<typeof createBorrowBorrowLimit>,
];

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes,
  value: string,
): ITransactionLimitsList;

export function createTransactionLimitsList(
  market: Market,
  type: TransactionTypes,
  value: string,
) {
  switch (type) {
    case TransactionTypes.approve:
      return [
        {
          ...createSupplyRates(market),
          title: '',
        } as ReturnType<typeof createSupplyRates>,
      ] as const;

    case TransactionTypes.collateral:
      return [
        {
          ...createSupplyBorrowLimit(type, market, value),
          title: '',
        } as ReturnType<typeof createSupplyBorrowLimit>,
      ] as const;

    case TransactionTypes.supply:
    case TransactionTypes.withdraw:
      return [
        createSupplyRates(market),
        createSupplyBorrowLimit(type, market, value),
      ] as const;

    case TransactionTypes.borrow:
    case TransactionTypes.repay:
      return [
        createBorrowRates(market),
        createBorrowBorrowLimit(type, market, value),
      ] as const;

    default:
      return void 0 as never;
  }
}
