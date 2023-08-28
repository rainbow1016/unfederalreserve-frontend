/**
 * GQL doc: https://thegraph.com/hosted-service/subgraph/ianlapham/uniswap-v3-subgraph
 */

import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { memoizeAsyncify, retryfy } from 'utils-decorators';
import { useCore } from '@/store/core/useCore';
import { env as ENVs } from '@/global';
import { POOL_SUPPORTED_TOKEN_MAP } from '@/helpers/enums/pools';
import { Await } from '@/types/utils';


const INFO_POOL_LINK_MAP = {
  ETH: 'https://info.uniswap.org/#/pools/0x6ae34e9cabaad597516c512a21c107e8701e2f33',
  USDC: 'https://info.uniswap.org/#/pools/0x1a69e59ad3d0258ccce0735098570c29ac57f149',
  USDT: 'https://info.uniswap.org/#/pools/0xcc4034f97af1560df547cfb33f5bf8e2edf3c9fa',
};

const THEGRAPH_BASE_URL = 'https://api.thegraph.com/subgraphs/name';


type TRequesterData = {
  operationName: string;
  variables: Record<string, unknown>;
};

const handleError = <T>(response: Response, requesterData: TRequesterData) => {
  if (!response.ok) return Promise.reject(response);
  return response.json()
    .then((data: T | { errors: unknown }) => {
      if ('errors' in data) {
        const message = `[App warn]: request error "thegraph/${requesterData.operationName}"`;
        // eslint-disable-next-line no-console
        console.warn(message, data.errors);
        return Promise.reject(data.errors);
      }

      return data;
    });
};

const requester = <T>(
  path: string,
  query: string,
  data: TRequesterData,
) => {
  const url = `${THEGRAPH_BASE_URL}/${path}`;

  const body = JSON.stringify({
    ...data,
    query: query.includes('#') ? query : query.replace(/(\s+|\n+|↵)/g, ' '),
  });

  return fetch(url, { method: 'POST', body }).then((response) => (
    handleError<{ data: T }>(response, data)
  ));
};


type TBlock = {
  number: `${number}`;
}

const getBlocks = (current: number, periodAgo: number) => {
  const path = 'blocklytics/ethereum-blocks';

  const label1 = 'current';
  const label2 = 'periodAgo';

  const data = {
    operationName: 'blocks',
    variables: {
      [label1]: current,
      [`${label1}_lt`]: current + 600,
      [label2]: periodAgo,
      [`${label2}_lt`]: periodAgo + 600,
    },
  };

  const createBlocksFragment = (label: string) => `
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: desc
      where: {
        timestamp_gt: $${label},
        timestamp_lt: $${label}_lt
      }
    ) {
      number
    }
  `;

  const query = `
    query blocks (
      $${label1}: Int!,
      $${label1}_lt: Int!,
      $${label2}: Int!,
      $${label2}_lt: Int!,
    ) {
      ${label1}: ${createBlocksFragment(label1)}
      ${label2}: ${createBlocksFragment(label2)}
    }
`;

  type TResultGetBlocks = { [label1]: [TBlock]; [label2]: [TBlock] }
  return requester<TResultGetBlocks>(path, query, data);
};

type TTopPool = {
  id: string;
}

const getTopPools = (address: string) => {
  const path = 'uniswap/uniswap-v3';

  const data = {
    operationName: 'topPools',
    variables: {
      address: address.toLowerCase(),
    },
  };

  const createTopPoolsFragment = (tokenName: string) => `
    pools(
      first: 200
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { ${tokenName}: $address }
      subgraphError: allow
    ) {
      id
    }
  `;

  const query = `
    query topPools($address: Bytes!) {
      asToken0: ${createTopPoolsFragment('token0')}
      asToken1: ${createTopPoolsFragment('token1')}
    }
`;

  type TResultGetTopPools = { asToken0: TTopPool[]; asToken1: TTopPool[] };
  return requester<TResultGetTopPools>(path, query, data);
};

export type TPoolToken = {
  id: string;
  symbol: string;
}

export type TPool = {
  id: string;
  feeTier: string;

  token0: TPoolToken;
  token1: TPoolToken;

  token0Price: string;
  token1Price: string;

  totalValueLockedToken0: string;
  totalValueLockedToken1: string;
  totalValueLockedUSD: string;

  volumeToken0: string;
  volumeToken1: string;
  volumeUSD: string;

  feesUSD: string;
}

const getPools = async (
  current: string,
  periodAgo: string,
  topPoolsInfo: Await<ReturnType<typeof getTopPools>>['data'],
) => {
  const path = 'uniswap/uniswap-v3';

  const label1 = 'current';
  const label2 = 'periodAgo';

  const id_in = [
    topPoolsInfo.asToken0,
    topPoolsInfo.asToken1,
  ].flat().map((_) => _.id);

  const data = {
    operationName: 'pools',
    variables: {
      id_in,
      [label1]: +current,
      [label2]: +periodAgo,
    },
  };

  const createPoolsFragment = (number: string) => `
    pools(
      where: {
        id_in: $id_in
      }
      block: {
        number: $${number}
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      feeTier
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      token0Price
      token1Price

      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedUSD

      volumeToken0
      volumeToken1
      volumeUSD

      feesUSD
    }
  `;

  const query = `
  query pools (
    $id_in: [String]!,
    $${label1}: Int!,
    $${label2}: Int!,
  ) {
    ${label1}: ${createPoolsFragment(label1)}
    ${label2}: ${createPoolsFragment(label2)}
  }
`;

  type TResultGetPools = { [label1]: [TPool]; [label2]: [TPool] }
  return requester<TResultGetPools>(path, query, data);
};

const retryfyParams = {
  delaysArray: [1000, 5000, 16000],
  delay: 1500,
};

const getBlocksMemoized = memoizeAsyncify(getBlocks, 60_000) as typeof getBlocks;
const getTopPoolsRetryfy = retryfy(getTopPools, retryfyParams) as typeof getTopPools;
const getPoolsRetryfy = retryfy(getPools, retryfyParams) as typeof getPools;

/*
type TToken = {
  id: string;
  symbol: string;
  totalValueLocked: string;
  feesUSD: string;
  totalValueLockedUSD: string;
}

const getTokens = async (address: string, current: string, periodAgo: string) => {
  const path = 'uniswap/uniswap-v3';

  const data = {
    operationName: 'tokens',
    variables: {},
  };

  const label1 = 'current';
  const label2 = 'periodAgo';

  const createTokensFragment = (number: string) => `
    tokens(
      where: {
        id_in: [
          "${address}"
        ]
      }
      block: {
        number: ${number}
      }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      totalValueLocked
      feesUSD
      totalValueLockedUSD
    }
  `;

  const query = `
    query tokens {
      ${label1}: ${createTokensFragment(current)}
      ${label2}: ${createTokensFragment(periodAgo)}
    }
`;

  type TResult = { [label1]: [TToken]; [label2]: [TToken] }
  return requester<TResult>(path, query, data);
};
*/

export const getPoolsAPY = async (poolApyPeriodDates: 7 | 30 | 365) => {
  const { account } = useCore();
  const markets = account.value?.markets;

  if (!markets) return null;

  const currentTime = Math.floor(+new Date() / 1e3 / 1e3) * 1e3 - 1 * 24 * 3600;
  const periodAgoTime = currentTime - poolApyPeriodDates * 24 * 3600;

  const promises = [
    getBlocksMemoized(currentTime, periodAgoTime),
    getTopPoolsRetryfy(ENVs.mainnet.eRSDL_ADDRESS),
  ] as const;

  const results = await Promise.all(promises);
  const [{ data: blocksInfo }, { data: topPoolsInfo }] = results;

  const currentNumber = blocksInfo.current[0]?.number;
  const periodAgoNumber = blocksInfo.periodAgo[0]?.number;

  if (!currentNumber || !periodAgoNumber) return null;

  const { data: poolsInfo } = await getPoolsRetryfy(currentNumber, periodAgoNumber, topPoolsInfo);

  const getFeesUSD = (
    tokenInfo: typeof poolsInfo.current[0] | undefined,
    priceUsd0: number,
    priceUsd1: number,
  ) => {
    if (!tokenInfo) return 0;

    const volumeUSD = (
      +tokenInfo.volumeToken0 * priceUsd0
      + +tokenInfo.volumeToken1 * priceUsd1
    );

    return volumeUSD / (1e6 / +tokenInfo.feeTier);
  };

  type TPoolKey = keyof typeof POOL_SUPPORTED_TOKEN_MAP;

  const list = poolsInfo.current.map((_, index) => {
    const currentTokenInfo = poolsInfo.current[index];
    const periodAgoTokenInfo = poolsInfo.periodAgo.find(({ id }) => id === currentTokenInfo.id);

    const token0Symbol = currentTokenInfo.token0.symbol.replace('WETH', 'ETH') as TPoolKey;
    const token1Symbol = currentTokenInfo.token1.symbol.replace('WETH', 'ETH') as TPoolKey;

    const tokenB = POOL_SUPPORTED_TOKEN_MAP[token0Symbol] || POOL_SUPPORTED_TOKEN_MAP[token1Symbol];
    // remove unsupported pool pairs
    if (!tokenB) return null;

    const priceUsd0 = markets.find((market) => market.symbol === token0Symbol)?.price_usd as number;
    const priceUsd1 = markets.find((market) => market.symbol === token1Symbol)?.price_usd as number;

    const feesUSD = (
      getFeesUSD(currentTokenInfo, priceUsd0, priceUsd1)
      - getFeesUSD(periodAgoTokenInfo, priceUsd0, priceUsd1)
    );

    const tvlUSD = (
      +currentTokenInfo.totalValueLockedToken0 * priceUsd0
      + +currentTokenInfo.totalValueLockedToken1 * priceUsd1
    );

    return {
      ...currentTokenInfo,
      name: tokenB.symbol,
      feesUSD,
      tvlUSD,
      infoLink: INFO_POOL_LINK_MAP[token1Symbol],
    };
  }).filter(Boolean);

  type TList = Exclude<(typeof list)[number], null>[];

  const listGrouped = groupBy(list, 'name') as Record<string, TList>;

  const listWithAPY = Object.values(listGrouped).map((data) => {
    const feesUSD = sumBy(data, 'feesUSD');
    const tvlUSD = sumBy(data, 'tvlUSD');

    const apy = (1 + (feesUSD * 365) / poolApyPeriodDates / tvlUSD / 365) ** 365 - 1;

    return {
      ...data[0],
      feesUSD,
      tvlUSD,
      days: poolApyPeriodDates,
      apy: Number.isFinite(apy) ? apy : 0,
    };
  }).sort((a, b) => {
    const A = POOL_SUPPORTED_TOKEN_MAP[a.name as TPoolKey];
    const B = POOL_SUPPORTED_TOKEN_MAP[b.name as TPoolKey];
    return A.position - B.position;
  });

  return listWithAPY;
};

/*
export const getErsdlAPY = async () => {
  const { account } = useCore();

  const currentTime = Math.floor(+new Date() / 1e3 / 1e3) * 1e3;
  const periodAgoTime = currentTime - POOL_APY_PERIOD_DATES * 24 * 3600;

  const { data: blocksInfo } = await getBlocksMemoized(currentTime, periodAgoTime);

  const currentNumber = blocksInfo.current[0]?.number;
  const periodAgoNumber = blocksInfo.periodAgo[0]?.number;

  if (!currentNumber || !periodAgoNumber) return null;

  const { data: tokensInfo } = await getTokens(ENVs.mainnet.eRSDL_ADDRESS, currentNumber, periodAgoNumber);

  const priceUsd = account.value?.eRSDL.price_usd;
  if (priceUsd === void 0) return null;

  const currentTokenInfo = tokensInfo.current[0];
  const periodAgoTokenInfo = tokensInfo.periodAgo[0];

  if (!currentTokenInfo || !periodAgoTokenInfo) return null;

  const feesUSD = +currentTokenInfo.feesUSD - +periodAgoTokenInfo.feesUSD;

  const tvlUSD = +currentTokenInfo.totalValueLocked * priceUsd;

  const APY = (1 + (feesUSD * 365) / POOL_APY_PERIOD_DATES / tvlUSD / 365) ** 365 - 1;

  return APY;
};
*/
