import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: Catalog,
    },
  ]
})
//amomercadopago.github.io

export default router;
