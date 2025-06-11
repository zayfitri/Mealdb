import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import MealDetail from '@/views/MealDetail.vue';
import Kategori from '@/views/Kategori.vue';
import Favorit from '@/views/Favorit.vue';
import ListBahan from '@/views/ListBahan.vue';
import BahanMakan from '@/views/BahanMakan.vue';
import ShopPage from '@/views/ecommerce/ShopPage.vue';
import ProductDetailPage from '@/views/ecommerce/ProductDetailPage.vue';
import CartPage from '@/views/ecommerce/CartPage.vue';
import CheckoutPage from '@/views/ecommerce/CheckoutPage.vue';
import UserDashboard from '@/views/ecommerce/UserDashboard.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresRole?: 'user' | 'seller' | 'courier' | 'admin';
  }
}

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/meal/:id', component: MealDetail, props: true },
  { path: '/kategori', component: Kategori },
  { path: '/favorit', component: Favorit },
  { path: '/bahan', component: ListBahan },
  { path: '/bahan/:name', component: BahanMakan, props: true },
  { path: '/shop', component: ShopPage},
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailPage, props: true},
  { path: '/cart', name: 'Cart', component: CartPage},
  { path: '/checkout', name: 'Checkout', component: CheckoutPage},
  { path: '/user-dashboard', name: 'UserDashboard', component: UserDashboard},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;