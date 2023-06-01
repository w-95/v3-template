import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import pinia from "@/store/store";
import Login from "@/pages/Login/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      keepAlive: false,
      requireAuth: true,
      transition: "animate__animated animate__fadeIn animate-custom-duration",
      transitionOut: "animate__animated animate__fadeOut animate-custom-duration",
      mode: "out-in" 
    },
    component: () => import('@/pages/index.vue'),
    children: [
      {
        path: '',
        name: 'Console',
        meta: { 
          transition: "animate__animated animate__fadeIn animate-custom-duration",
          transitionOut: "animate__animated animate__fadeOut animate-custom-duration",
          requireAuth: true, 
          mode: "out-in" 
        },
        component: () => import('@/pages/Console/index.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: false,
      requireAuth: false,
      transition: "animate__animated animate__fadeIn animate-custom-duration-03",
      transitionOut: "animate__animated animate__fadeOut animate-custom-duration-03",
      mode: "out-in"
    },
    component: Login,
    children: [
      {
        path: '',
        name: 'LoginFirm',
        meta: { 
          transition: "animate__animated animate__fadeIn animate-custom-duration-03",
          transitionOut: "animate__animated animate__fadeOut animate-custom-duration-0",
          mode: "out-in", 
          requireAuth: false 
        },
        component: () => import('@/pages/Login/login_form.vue'),
      },
      {
        path: '/forgotpwd',
        name: 'ForgotPassword',
        meta: { 
          transition: "animate__animated animate__fadeIn animate-custom-duration",
          transitionOut: "animate__animated animate__fadeOut animate-custom-duration",
          mode: "out-in", 
          requireAuth:  false 
        },
        component: () => import('@/pages/Login/forgot_password.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { useGlobalStore } from '@/store/global';


router.beforeEach((to , from , next) => {
  const globalStore = useGlobalStore(pinia);
  if (to.meta.requireAuth && !globalStore.checkAuth()) {
    router.push({ name: "LoginFirm"});
  };
  next();
})

export default router;
