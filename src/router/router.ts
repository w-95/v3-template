import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import pinia from "@/store/store";
import Login from "@/pages/Login/index.vue";
import Index from '@/pages/index.vue';
import Console from '@/pages/Console/index.vue';

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
    component: Index,
    children: [
      {
        path: '',
        name: 'Console',
        meta: { 
          title: "控制台",
          keepAlive: true,
          transition: "animate__animated animate__fadeIn animate-custom-duration",
          transitionOut: "animate__animated animate__fadeOut animate-custom-duration",
          requireAuth: true, 
          mode: "out-in" 
        },
        component: Console,
      },
      {
        path: '/product/list',
        name: 'ProdList',
        meta: { 
          title: "产品列表",
          transition: "animate__animated animate__fadeInLeft animate-custom-duration",
          transitionOut: "animate__animated animate__fadeOutRight animate-custom-duration",
          requireAuth: true, 
          mode: "out-in" 
        },
        component: () => import('@/pages/product/list.vue'),
      },
      {
        path: '/product/edit',
        name: 'ProdEdit',
        meta: { 
          title: "产品编辑",
          transition: "animate__animated animate__fadeInLeft animate-custom-duration",
          transitionOut: "animate__animated animate__fadeOutRight animate-custom-duration",
          requireAuth: true, 
          mode: "out-in" 
        },
        component: () => import('@/pages/productEdit/index.vue'),
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
        name: 'LoginForm',
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


router.beforeEach((to , _from, next) => {
  const globalStore = useGlobalStore(pinia);
  if (to.meta.requireAuth && !globalStore.checkAuth()) {
    router.push({ name: "LoginForm"});
  };
  next();
})

export default router;
