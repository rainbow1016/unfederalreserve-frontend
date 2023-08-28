import { RouteRecordRaw } from 'vue-router';
import { ROUTE_MARKETS } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/markets',
    name: ROUTE_MARKETS,
    component: () => import(
      /* webpackChunkName: "markets.index" */
      /* webpackExports: ["default"] */
      './ViewMarkets.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
