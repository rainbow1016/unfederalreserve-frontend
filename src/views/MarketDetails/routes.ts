import { RouteRecordRaw } from 'vue-router';
import { ROUTE_MARKET_DETAILS } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/market-details/:symbol',
    redirect: { name: ROUTE_MARKET_DETAILS },
  },
  {
    path: '/markets/:symbol',
    name: ROUTE_MARKET_DETAILS,
    props: true,
    component: () => import(
      /* webpackChunkName: "market-details.index" */
      /* webpackExports: ["default"] */
      './ViewMarketDetails.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
