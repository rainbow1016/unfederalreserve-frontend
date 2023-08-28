import { RouteRecordRaw } from 'vue-router';
import { ROUTE_POOL } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/pools',
    alias: ['/pool'],
    name: ROUTE_POOL,
    component: () => import(
      /* webpackChunkName: "pool.list" */
      /* webpackExports: ["default"] */
      './ViewPool.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
