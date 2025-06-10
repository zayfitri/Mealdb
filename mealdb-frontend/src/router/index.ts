import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import MealDetail from '@/views/MealDetail.vue';
import Kategori from '@/views/Kategori.vue';
import Favorit from '@/views/Favorit.vue';
import ListBahan from '@/views/ListBahan.vue';
import BahanMakan from '@/views/BahanMakan.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/meal/:id', component: MealDetail, props: true },
  { path: '/kategori', component: Kategori },
  { path: '/favorit', component: Favorit },
  { path: '/bahan', component: ListBahan },
  { path: '/bahan/:name', component: BahanMakan, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
