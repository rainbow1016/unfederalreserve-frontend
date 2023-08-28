
import { RouteRecordRaw } from 'vue-router';
import { ROUTE_STATIC_TERMS, ROUTE_STATIC_LOANS } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/terms',
    name: ROUTE_STATIC_TERMS,
    component: () => import(
      /* webpackChunkName: "static.terms" */
      /* webpackExports: ["default"] */
      './ViewTerms.vue'
    ),
  },
  {
    path: '/loan',
    name: ROUTE_STATIC_LOANS,
    component: () => import(
      /* webpackChunkName: "static.loan" */
      /* webpackExports: ["default"] */
      './ViewLoan.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
