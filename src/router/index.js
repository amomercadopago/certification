import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';
import Detail from '../views/Detail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: Catalog,
    },
    {
      path: '/products/:id',
      name: 'detail',
      component: Detail,
    },
  ]
})

export default router;
