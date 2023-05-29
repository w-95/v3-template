import { createApp } from 'vue';
import elementPlus from 'element-plus';
import jsCookie from "js-cookie";
import i18n from '@/locales'
import 'element-plus/dist/index.css';

import '@/assets/fonts/iconfont.css';
import 'animate.css';
import './style.css';

import App from './App.vue';
import router from './router/router';
import pinia from "@/store/store";
import { useThemeStore } from '@/store/theme';
import { useGlobalStore } from '@/store/global';
import { theme } from './interface/enum';
import { themeVar, loginTokenVar, userInfoVar, leftMenuRoutersVar } from "@/data/index";

console.log(i18n)
const app = createApp(App);

app.use(elementPlus);
app.use(pinia);
app.use(router);
app.use(i18n);

const themeStore = useThemeStore();
const globalStore = useGlobalStore();

const LOCAL_LOGIN_TOKEN = jsCookie.get(loginTokenVar);
const LOCAL_USERINFO = localStorage.getItem(userInfoVar);
const LOCAL_MENUROUES = localStorage.getItem(leftMenuRoutersVar);
const LOCAL_THEME: theme = localStorage.getItem("THEME") as theme;

// 同步主题
themeStore.updateSystemTheme(LOCAL_THEME? LOCAL_THEME :theme.defaultTheme);
if(!LOCAL_THEME) {
    localStorage.setItem(themeVar, theme.defaultTheme)
};

if( LOCAL_LOGIN_TOKEN && LOCAL_USERINFO && LOCAL_MENUROUES) {

    // 同步用户信息
    globalStore.userInfo = JSON.parse(LOCAL_USERINFO);

    // 同步侧边栏导航
    globalStore.menuRoutes = JSON.parse(LOCAL_MENUROUES);
}


app.mount('#app');
