import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
// import Home from '../views/Home.vue';
// import Member from '../views/Member.vue';
// import Student from '../views/Student.vue';
// import Demo from '../views/Demo.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    // },
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component:  () => import('../views/Member.vue'), //Member,
      children: [
        {
          path: '',
          name: 'overview',
          component: () => import('../components/Member/Overview/index.vue'),
        },
        {
          path: '/dashboard/activity',
          name: 'activity',
          component: () => import('../components/Member/Activity/index.vue'),
        },
        {
          path: '/dashboard/activity/:club/:activity_uuid',
          name: 'activity-slug',
          component: () => import('../components/Member/Activity/Slug/index.vue'),
        },
        {
          path: '/dashboard/club-organizatons',
          name: 'clubOrg',
          component: () => import('../components/Member/ClubOrg/index.vue'),
        },
        {
          path: '/dashboard/manage',
          name: 'manage',
          component: () => import('../components/Member/Manage/index.vue'),
          children: [
            {
              path: '',
              name: 'club-org',
              component: () => import('../components/Member/Manage/Club.vue'),
            },
            {
              path: '/dashboard/manage/category',
              name: 'category',
              component: () => import('../components/Member/Manage/Category.vue'),
            },
            {
              path: '/dashboard/manage/school-year',
              name: 'school-year',
              component: () => import('../components/Member/Manage/SchoolYear.vue'),
            },
          ]
        },
        {
          path: '/dashboard/users',
          name: 'users',
          component: () => import('../components/Member/Users/index.vue')
        },
        {
          path: '/server-health',
          name: 'server-health',
          component: () => import('../components/Member/ServerHealth/index.vue')
        }
      ],
      
    },
    {
      path: '/student/dashboard',
      name: 'student-dashboard',
      component:  () => import('../views/Student.vue'), //Student,
      children: [
        {
          path: '',
          name: 'student-clubOrg',
          component: () => import('../components/Student/ClubOrg/index.vue'),
        },
        {
          path: '/student/dashboard/activity',
          name: 'student-activity',
          component: () => import('../components/Student/Activity/index.vue'),
        },
        {
          path: '/student/dashboard/activity/:club/:activity_uuid',
          name: 'student-activity-slug',
          component: () => import('../components/Student/Activity/Slug/index.vue'),
        },

      ],
      
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/Demo.vue') //Demo
    },
    {
      path: '/:notFound',
      name: '404',
      component: () => import('../views/404.vue'),
    },
  ],
});

export default router;
