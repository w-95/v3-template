import { createApp } from 'vue';
import elementPlus from 'element-plus';

import '@/assets/fonts/iconfont.css';
import 'animate.css';

import './style.css';
import 'element-plus/dist/index.css';

import App from './App.vue';

import pinia from "@/store/store";
import router from './router/router';

import { useThemeStore } from './store/theme';
import { theme } from './interface/enum';

import { themeVar } from "@/data/index";

const app = createApp(App);

app.use(elementPlus);
app.use(pinia);
app.use(router);

const themeStore = useThemeStore();
const localTheme: theme = localStorage.getItem("THEME") as theme;
themeStore.updateSystemTheme(localTheme? localTheme :theme.defaultTheme);
if(!localTheme) {
    localStorage.setItem(themeVar, theme.defaultTheme)
};

app.mount('#app');
