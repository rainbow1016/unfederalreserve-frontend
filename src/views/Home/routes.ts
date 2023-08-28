
import { RouteRecordRaw } from 'vue-router';
import { ROUTE_LEND } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/lend',
    name: ROUTE_LEND,
    component: () => import(
      /* webpackChunkName: "home.index" */
      /* webpackExports: ["default"] */
      './ViewHome.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
