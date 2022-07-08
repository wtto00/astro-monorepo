import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

export default function initRouter(projectRoutes, mode) {
  const routes = [
    ...projectRoutes,
    // {
    //   path: '/common-page',
    //   component: () => import('../views/CommonPage/CommonPage.vue'),
    // },
  ];

  const router = createRouter({
    history:
      mode !== 'hash' ? createWebHistory(import.meta.env.BASE_URL) : createWebHashHistory(import.meta.env.BASE_URL),
    routes,
  });

  router.afterEach((to) => {
    if (to.meta.title) {
      document.title = to.meta.title.toString();
    }
  });

  return router;
}
