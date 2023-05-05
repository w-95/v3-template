import { createApp } from 'vue';
import { createPinia } from 'pinia';
import elementPlus from 'element-plus';

import './style.css';
import 'element-plus/dist/index.css';

import App from './App.vue';

import router from './router/router';

const app = createApp(App);

app.use(elementPlus);
app.use(router);
app.use(createPinia());

app.mount('#app');
