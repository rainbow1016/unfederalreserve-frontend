import { RouteRecordRaw } from 'vue-router';
import {
  ROUTE_POOL_LIQUIDITY,
  ROUTE_POOL_LIQUIDITY_INCREASE,
} from '@/helpers/enums/routes';
import {
  POOL_SUPPORTED_TOKEN_A_LIST,
  POOL_SUPPORTED_TOKEN_B_LIST,
  POOL_SUPPORTED_FEES,
  POOL_SUPPORTED_TOKEN_MAP,
} from '@/helpers/enums/pools';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: [
      '/pools/add',
      `:tokenIdA(${POOL_SUPPORTED_TOKEN_A_LIST.join('|')})?`,
      `:tokenIdB(${POOL_SUPPORTED_TOKEN_B_LIST.join('|')})?`,
      `:fee(${POOL_SUPPORTED_FEES.join('|')})?`,
    ].join('/'),
    name: ROUTE_POOL_LIQUIDITY,
    props: ({ params: p }) => ({ ...p, fee: +p.fee }),
    beforeEnter(to, from, next) {
      const { tokenIdA, tokenIdB, fee } = to.params;

      const isCurrentlyParams = (
        tokenIdA
        && tokenIdB
        && fee
        && tokenIdA !== tokenIdB
      );

      if (isCurrentlyParams) {
        next();
      } else if (tokenIdB && tokenIdB === tokenIdA) {
        const params = { ...to.params };
        delete params.tokenIdA;
        delete params.tokenIdB;
        next({ ...to, params });
      } else {
        const tokenIdAParam = tokenIdA || POOL_SUPPORTED_TOKEN_A_LIST[0];
        const tokenIdBParam = tokenIdB && tokenIdB !== tokenIdA
          ? tokenIdB
          : POOL_SUPPORTED_TOKEN_MAP.ETH.symbol;

        const feeParam = (
          fee
          || POOL_SUPPORTED_TOKEN_MAP[tokenIdBParam as keyof typeof POOL_SUPPORTED_TOKEN_MAP].fee
        );

        const params = {
          ...to.params,
          tokenIdA: tokenIdAParam,
          tokenIdB: tokenIdBParam,
          fee: feeParam,
        };
        next({ ...to, params });
      }
    },
    component: () => import(
      /* webpackChunkName: "pool.liquidity.add" */
      /* webpackExports: ["default"] */
      './ViewPoolAddLiquidity.vue'
    ),
  },
  {
    path: '/pools/:tokenId/increase',
    name: ROUTE_POOL_LIQUIDITY_INCREASE,
    props: true,
    component: () => import(
      /* webpackChunkName: "pool.liquidity.increase" */
      /* webpackExports: ["default"] */
      './ViewPoolIncreaseLiquidity.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
