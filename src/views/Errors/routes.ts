import { RouteRecordRaw } from 'vue-router';
import { ROUTE_ERRORS, ROUTE_ERROR_404 } from '@/helpers/enums/routes';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/error/:error_code(\\d+)',
    name: ROUTE_ERRORS,
    beforeEnter(to, from, next) {
      if ('fullPath' in to.params) {
        next();
      } else {
        const params = {
          ...to.params,
          fullPath: (from.name ? from.fullPath : ''),
        };
        next({ ...to, params });
      }
    },
    props: ({ params: p }) => ({ ...p, error_code: +p.error_code }),
    component: () => import(
      /* webpackChunkName: "errors.errors" */
      /* webpackExports: ["default"] */
      './ViewErrors.vue'
    ),
  },
  {
    path: '/:path_match(.*)*',
    name: ROUTE_ERROR_404,
    props: ({ params: p }) => ({ ...p, error_code: 404 }),
    component: () => import(
      /* webpackChunkName: "errors.errors" */
      /* webpackExports: ["default"] */
      './ViewErrors.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
