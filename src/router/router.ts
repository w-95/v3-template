import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { useGlobalStore } from '@/store/global';
import pinia from "@/store/store";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      keepAlive: false,
      requireAuth: true,
      transition: "fade"
    },
    component: () => import('@/pages/index.vue'),
    children: [
      {
        path: '',
        name: 'Console',
        meta: { transition: "fade", requireAuth: true },
        component: () => import('@/pages/Console/index.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false,
      transition: "fade"
    },
    component: () => import('@/pages/Login/index.vue'),
    children: [
      {
        path: '',
        name: 'LoginFirm',
        meta: { transition: "fade", requireAuth: false },
        component: () => import('@/pages/Login/login_form.vue'),
      },
      {
        path: '/forgotpwd',
        name: 'ForgotPassword',
        meta: { transition: "fade", requireAuth:  false },
        component: () => import('@/pages/Login/forgot_password.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const globalStore = useGlobalStore(pinia);

router.beforeEach((to , from , next) => {

  if (to.meta.requireAuth && !globalStore.checkAuth()) {
    router.push({ name: "LoginFirm"});
  };
  next();
})

export default router;
