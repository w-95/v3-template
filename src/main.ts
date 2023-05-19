import { createApp } from 'vue';
import elementPlus from 'element-plus';

import '@/assets/fonts/iconfont.css';

import './style.css';
import 'element-plus/dist/index.css';

import App from './App.vue';

import pinia from "@/store/store";
import router from './router/router';

const app = createApp(App);

app.use(elementPlus);
app.use(pinia);
app.use(router);


app.mount('#app');
