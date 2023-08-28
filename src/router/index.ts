import {
  Router,
  createRouter as createVueRouter,
  createWebHistory,
} from 'vue-router';
import { createRoutes } from './routes';


export const createRouter = (): Router => {
  const router = createVueRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [],
    scrollBehavior(to, from, savedPosition) {
      if (to.name === from.name) {
        return void 0;
      }

      /*
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        };
      }
      */

      if (savedPosition) {
        return savedPosition;
      }

      return { top: 0 };
    },
  });

  const routes = createRoutes({ router });
  routes.forEach((route) => router.addRoute(route));

  return router;
};
