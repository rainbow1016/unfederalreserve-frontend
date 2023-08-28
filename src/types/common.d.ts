import { App } from 'vue';
import { Router } from 'vue-router';

import { TRANSACTION_STATUSES } from '@/helpers/enums/params';


export interface IInitPlugin {
  (app: App, options: {
    router: Router;
  }): void;
}

export interface IHistoryTransaction {
  hash: string;
  status?: typeof TRANSACTION_STATUSES[keyof typeof TRANSACTION_STATUSES];
  position?: IPositionData;
}

import WalletTypes = require('@/classes/Wallet');

export type Wallet = WalletTypes.Wallet;

import AccountTypes = require('@/classes/Account');

export type Account = AccountTypes.Account;

import MarketTypes = require('@/classes/Market');

export type Market = MarketTypes.Market;

import PositionTypes = require('@/classes/Position');

export type Position = PositionTypes.Position;

import PoolTokenTypes = require('@/classes/PoolToken');

export type PoolToken = PoolTokenTypes.PoolToken;

export type IPositionData = {
  tokenA: {
    symbol: string;
    icon?: string;
  };

  tokenB: {
    symbol: string;
    icon?: string;
  };

  tokenId?: string;

  fee?: 500 | 3000 | 10_000;

  isClosed: boolean;
  inRange: boolean;

  minPrice: string | number;
  maxPrice: string | number;
}
