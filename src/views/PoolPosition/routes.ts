import { RouteRecordRaw } from 'vue-router';
import { ROUTE_POOL_POSITION } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/pools/:tokenId(\\d+)',
    name: ROUTE_POOL_POSITION,
    props: true,
    component: () => import(
      /* webpackChunkName: "pool.position" */
      /* webpackExports: ["default"] */
      './ViewPoolPosition.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
