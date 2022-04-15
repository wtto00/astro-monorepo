import { createApp } from 'vue';
import { createPinia } from 'pinia';
import initRouter from '@/router';
import App from './App.vue';

import projectRouter from './router';

const router = initRouter(projectRouter, import.meta.env.VITE_ROUTE_MODE);

const pinia = createPinia();

createApp(App).use(router)
  .use(pinia)
  .mount('#app');
