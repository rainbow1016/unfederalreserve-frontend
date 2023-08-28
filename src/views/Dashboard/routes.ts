import { RouteRecordRaw } from 'vue-router';
import { ROUTE_DASHBOARD } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/',
    name: ROUTE_DASHBOARD,
    component: () => import(
      /* webpackChunkName: "dashboard" */
      /* webpackExports: ["default"] */
      './ViewDashboard.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
