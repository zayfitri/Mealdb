import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
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
import LoginPage from '@/views/auth/LoginPage.vue';
import AddProductPage from '@/views/ecommerce/AddProductPage.vue';
import ManageProductsPage from '@/views/ecommerce/ManageProductsPage.vue';
import CourierDashboard from '@/views/ecommerce/CourierDashboard.vue';
import AdminDashboard from '@/views/ecommerce/AdminDashboard.vue';

import { useUserStore } from '@/stores/user'; 

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresRole?: 'user' | 'courier' | 'admin';
  }
}

const routes: Array<RouteRecordRaw> = [
  // Rute Publik/General User (akses akan difilter di beforeEach)
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/meal/:id', name: 'MealDetail', component: MealDetail, props: true },
  { path: '/kategori', name: 'Kategori', component: Kategori },
  { path: '/favorit', name: 'Favorit', component: Favorit },
  { path: '/bahan', name: 'ListBahan', component: ListBahan },
  { path: '/bahan/:name', name: 'BahanMakan', component: BahanMakan, props: true },
  { path: '/shop', name: 'Shop', component: ShopPage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailPage, props: true },
  
  // Rute Autentikasi
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresAuth: false } },

  // Rute Khusus Pengguna (Pembeli/Penjual)
  { path: '/cart', name: 'Cart', component: CartPage, meta: { requiresAuth: true, requiresRole: 'user' } },
  { path: '/checkout', name: 'Checkout', component: CheckoutPage, meta: { requiresAuth: true, requiresRole: 'user' } },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, requiresRole: 'user' }
  },
  {
    path: '/user-dashboard/add-product', 
    name: 'AddProductForUser', 
    component: AddProductPage,
    meta: { requiresAuth: true, requiresRole: 'user' }
  },
  {
    path: '/user-dashboard/manage-products', 
    name: 'ManageProductsForUser',
    component: ManageProductsPage,
    meta: { requiresAuth: true, requiresRole: 'user' }
  },

  // Rute Khusus Kurir
  {
    path: '/courier-dashboard',
    name: 'CourierDashboard',
    component: CourierDashboard,
    meta: { requiresAuth: true, requiresRole: 'courier' }
  },

  // Rute Khusus Admin
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/admin-dashboard/add-product', 
    name: 'AddProductForAdmin',
    component: AddProductPage, 
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/admin-dashboard/manage-products', 
    name: 'ManageProductsForAdmin', 
    component: ManageProductsPage, 
    meta: { requiresAuth: true, requiresRole: 'admin' } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn;
  const userRole = userStore.getLoggedInUser?.role;

  // --- DEBUGGING: Tambahkan log ini untuk melihat apa yang sedang dicek ---
  console.log('Navigating to:', to.path);
  console.log('Requires Auth:', to.meta.requiresAuth);
  console.log('Requires Role:', to.meta.requiresRole);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('User Role (current):', userRole);
  // --- END DEBUGGING ---

  const allowedUserRoutes = [
    '/home', '/kategori', '/bahan', '/favorit', '/shop', '/product', '/meal', 
    '/cart', '/checkout', '/user-dashboard', '/user-dashboard/add-product', '/user-dashboard/manage-products'
  ];
  const allowedCourierRoutes = [
    '/courier-dashboard'
  ];
  const allowedAdminRoutes = [
    '/admin-dashboard', '/admin-dashboard/add-product', '/admin-dashboard/manage-products'
  ];

  // 1. Jika pengguna sudah login dan mencoba mengakses halaman login, arahkan ke dashboard yang sesuai
  if (isAuthenticated && to.path === '/login') {
    if (userRole === 'user') {
      return next('/user-dashboard');
    } else if (userRole === 'courier') {
      return next('/courier-dashboard');
    } else if (userRole === 'admin') {
      return next('/admin-dashboard');
    }
  }

  // 2. Periksa autentikasi untuk rute yang dilindungi
  if (to.meta.requiresAuth && !isAuthenticated) {
    alert('Anda harus login untuk mengakses halaman ini.');
    return next('/login');
  }

  // 3. Periksa peran untuk rute yang dilindungi (jika ada meta.requiresRole)
  if (isAuthenticated && to.meta.requiresRole && userRole !== to.meta.requiresRole) {
    alert(`Akses ditolak. Halaman ini hanya untuk ${to.meta.requiresRole}.`);
    if (userRole === 'user') {
      return next('/user-dashboard');
    } else if (userRole === 'courier') {
      return next('/courier-dashboard');
    } else if (userRole === 'admin') {
      return next('/admin-dashboard');
    } else { 
      return next('/home');
    }
  }

  // 4. Pembatasan akses umum berdasarkan peran (jika sudah login)
  if (isAuthenticated) {
    if (userRole === 'user' && !allowedUserRoutes.some(path => to.path.startsWith(path)) && to.path !== '/login') {
        alert('Anda tidak memiliki akses ke halaman ini sebagai pengguna.');
        return next('/user-dashboard');
    }
    if (userRole === 'courier' && !allowedCourierRoutes.some(path => to.path.startsWith(path)) && to.path !== '/login') {
      alert('Sebagai kurir, Anda hanya bisa mengakses dashboard kurir Anda.');
      return next('/courier-dashboard');
    }
    if (userRole === 'admin' && !allowedAdminRoutes.some(path => to.path.startsWith(path)) && to.path !== '/login') {
      alert('Sebagai admin, Anda hanya bisa mengakses dashboard admin Anda atau rute yang relevan.');
      return next('/admin-dashboard');
    }
  }

  next();
});

export default router;
