import {
  getAllMarkets,
  getAccountLiquidity,
  getLiquidationEvents,
  getGasPrice,
} from '@/services/api';
import { getPoolsAPY } from '@/services/getErsdlPoolAPY';
import { getErsdlPrice } from '@/services/getErsdlPrice';
import { getSnapshot } from '@/services/getSnapshot';
import { getLegal, setLegal } from '@/services/legal';

import { sortMarketsByUnderlying } from '@/helpers/sortMarkets';
import { LEGACY_eRSDL_TOKEN_MAP, HIDDEN_TOKEN_MAP } from '@/helpers/enums/tokens';
import { createFetch } from './createFetchList';


const getAllMarketsSort = (
  ...args: Parameters<typeof getAllMarkets>
) => getAllMarkets(...args).then((markets) => (
  markets
    .filter((market) => {
      const address = market.address.toLowerCase();
      return !HIDDEN_TOKEN_MAP[address];
    })
    .map((market) => {
      const address = market.address.toLowerCase();
      const tokenLegacy = LEGACY_eRSDL_TOKEN_MAP[address];

      if (!tokenLegacy) {
        return {
          ...market,
          symbol: market.symbol.replace('legacy_', ''),
          name: market.name.replace('legacy_', ''),
          underlyingSymbol: market.underlyingSymbol.replace('legacy_', ''),
        };
      }

      return {
        ...market,
        isLegacy: true,
        name: tokenLegacy.name,
        symbol: tokenLegacy.symbol,
        underlyingSymbol: tokenLegacy.underlyingSymbol,
      };
    })
    .sort(sortMarketsByUnderlying)
));

export const useFetchMarkets = createFetch(getAllMarketsSort, true, true);

export const useAccountLiquidity = createFetch(getAccountLiquidity, true, true);

export const useLiquidationEvents = createFetch(getLiquidationEvents, true, true);

export const useGasPrice = createFetch(getGasPrice, false, false);

export const usePoolsAPY = createFetch(getPoolsAPY, false, false);

export const useErsdlPrice = createFetch(getErsdlPrice, false, false);

export const useSnapshot = createFetch(getSnapshot, false, false);

export const useGetLegal = createFetch(getLegal, false, false);

export const useSetLegal = createFetch(setLegal, false, false);
