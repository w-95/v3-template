import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/a',
    name: 'Console',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true,
      transition: "fade"
    },
    component: () => import('@/pages/Console/index.vue'),
  },
  {
    path: '/',
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
        path: '/',
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

router.beforeEach((to, from) => {
  // if (to.meta.requiresAuth && !auth.isLoggedIn()) {}
})

export default router;
