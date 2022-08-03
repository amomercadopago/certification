import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/category.css';
import './assets/category-landing.css';
import './assets/merch-tools.css';
import './assets/bootstrap.min.css';
import './assets/custom.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
