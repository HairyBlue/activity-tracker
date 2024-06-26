import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/overview',
      name: 'overview',
      component: () => import('../views/Overview.vue'),
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('../views/Activity.vue'),
    },
    {
      path: '/clubs-and-organizatons',
      name: 'clubs',
      component: () => import('../views/Clubs.vue'),
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/Manage.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/User.vue'),
    },
    {
      path: '/:notFound',
      name: '404',
      component: () => import('../views/404.vue'),
    },
  ],
});

export default router;
