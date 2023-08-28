import { RouteRecordRaw } from 'vue-router';
import { ROUTE_POOL_LIQUIDITY_REMOVE } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/pools/:tokenId(\\d+)/remove',
    name: ROUTE_POOL_LIQUIDITY_REMOVE,
    props: true,
    component: () => import(
      /* webpackChunkName: "pool.liquidity.remove" */
      /* webpackExports: ["default"] */
      './ViewPoolRemoveLiquidity.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
