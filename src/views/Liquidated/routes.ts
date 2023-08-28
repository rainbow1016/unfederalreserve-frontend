import { RouteRecordRaw } from 'vue-router';
import { ROUTE_LIQUIDATED } from '@/helpers/enums/routes';
import { LiquidatedTabs } from './utils';


const createRoutes = (): RouteRecordRaw[] => [
  {
    path: '/liquidated',
    name: ROUTE_LIQUIDATED,
    beforeEnter(to, from, next) {
      const tab = to.hash?.replace('#', '') as LiquidatedTabs;
      const withTab = Object.values(LiquidatedTabs).includes(tab);

      if (withTab) {
        next();
      } else {
        const hash = `#${LiquidatedTabs.at_risk}`;
        next({ ...to, hash });
      }
    },
    props: ({ hash }) => ({ tab: hash.replace('#', '') }),
    component: () => import(
      /* webpackChunkName: "liquidated.index" */
      /* webpackExports: ["default"] */
      './ViewLiquidated.vue'
    ),
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createModule = (options: unknown) => {
  const routes = createRoutes();
  return routes;
};

export default createModule;
