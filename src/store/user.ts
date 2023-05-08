import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: '',
    };
  },
  actions: {

    // 登录
    signIn() {

    },

    // 注册
    signUp() {

    },

    // 退出登录
    signOut() {

    },
    
    updateName(name: string) {
      this.name = name;
    },
  },
});
