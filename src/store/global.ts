import { defineStore } from 'pinia';

import jsCookie from "js-cookie";

import { singin, getUserInfo, getMenuRoute } from "@/request/user.ts";
import { loginParamT } from "@/interface/apiParams.ts";

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => {
    return {
      userInfo: null,
      menuRoutes: [],
      globalLoading: false,
      isAuth: false,
      token: ""
    }
  },

  getters: {

  },

  actions: {
    // 校验是否登录
    checkAuth() {
      const loginToken = jsCookie.get('loginToken');
      if(loginToken) {
        this.isAuth = true;
        return true;
      }else {
        this.isAuth = false;
        return false;
      };
    },

    // 登录
    async signIn( loginParam: loginParamT) {
      this.setGlobalLoading( true );
      let result: { data: string; status: number; msg?: string } = await singin(loginParam);
      const { data, status } = result;

      if(data && status === 0) {
        jsCookie.set('loginToken', data, {
          path: '/',
          domain: window.location.hostname,
        });
      };

      return result;
    },

    // 注册
    signUp() {},

    // 退出登录
    signOut() {},

    // 更新用户信息和用户的侧边栏
    async updateUserInfo() {

      const requestAll = await Promise.all([ await getUserInfo(), await getMenuRoute()]);

      const [userInfoResult, menuRouteResult] = requestAll;

      const { data: menuData, status: menuStatus} = menuRouteResult;
      const { data: infoData, status: infoStatus} = userInfoResult;

      // 将用户信息存起来
      if(infoData && infoStatus ===0) {
        this.userInfo = infoData;
      };

      // 将导航侧边栏存起来
      if(menuData && menuStatus === 0) {
        this.menuRoutes = menuData;
      };

      return requestAll;
    },

    setGlobalLoading(checkLoading: boolean) {
      this.globalLoading = checkLoading;
    },
  },
});