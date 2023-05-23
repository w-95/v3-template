import { defineStore } from 'pinia';
import { theme } from '@/interface/enum';

export const useThemeStore = defineStore({
  id: 'theme',
  state: () => {
    return {
      systemTheme: theme.defaultTheme,
    };
  },

  actions: {
    updateSystemTheme(theme: theme) {
      this.systemTheme = theme;
    },
  },

  getters: {
    getSystemTheme( state) {
      return state.systemTheme
    }
  },
});
