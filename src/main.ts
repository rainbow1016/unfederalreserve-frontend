import '@/assets/scss/main.scss';

import { createApp } from 'vue';
import { initPlugins } from '@/plugins';
import { createRouter } from '@/router';
import { initialize } from '@/store';

import App from './App.vue';


const router = createRouter();
void initialize();

const app = createApp(App);

// need for devtools in stands
app.config.performance = process.env.VUE_APP_ENV !== 'master';

app
  .use(initPlugins, { router })
  .use(router)
  .mount('#app');
