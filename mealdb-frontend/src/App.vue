<script setup>
import { Home, Heart, Utensils, List, ShoppingCart, User, LogIn, LogOut, Truck, Settings } from 'lucide-vue-next'; 
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const cartStore = useCartStore();
const userStore = useUserStore();
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Navbar Global -->
    <div class="bg-yellow-500 p-4 flex items-center justify-between w-full fixed top-0 left-0 z-50 shadow-md">
      <!-- Bagian kiri navbar (logo dan nama aplikasi) -->
      <RouterLink to="/home" class="flex items-center space-x-2">
        <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12 rounded-full" />
        <span class="text-white text-2xl font-bold hidden sm:block">Meal+Shop</span> 
      </RouterLink>

      <!-- Bagian kanan navbar (Link Keranjang, Link Akun, dan Login/Logout) -->
      <div class="flex items-center space-x-4">
        <!-- Link Keranjang (Hanya tampil untuk user atau jika belum login) -->
        <RouterLink v-if="userStore.getLoggedInUser?.role === 'user' || !userStore.isLoggedIn" 
                    to="/cart" class="flex items-center text-white text-sm hover:text-gray-200 relative"> 
          <span v-if="cartStore.totalItems > 0" 
                class="absolute -top-1 -left-1 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5 
                       flex items-center justify-center min-w-[1.25rem] h-5">
            {{ cartStore.totalItems }}
          </span>
          <ShoppingCart class="w-6 h-6" />
          <span class="ml-1 hidden sm:block">Keranjang</span>
        </RouterLink>

        <!-- Link Akun Saya (Hanya tampil untuk user atau jika belum login) -->
        <RouterLink v-if="userStore.getLoggedInUser?.role === 'user' || !userStore.isLoggedIn" 
                    to="/user-dashboard" class="flex items-center text-white text-sm hover:text-gray-200">
          <User class="w-6 h-6" />
          <span class="ml-1 hidden sm:block">Akun Saya</span>
        </RouterLink>

        <!-- Tombol Login/Logout -->
        <RouterLink v-if="!userStore.isLoggedIn" to="/login" class="flex items-center text-white text-sm hover:text-gray-200">
            <LogIn class="w-6 h-6" />
            <span class="ml-1 hidden sm:block">Login</span>
        </RouterLink>
        <button v-else @click="userStore.logout()" class="flex items-center text-white text-sm hover:text-gray-200 focus:outline-none">
            <LogOut class="w-6 h-6" />
            <span class="ml-1 hidden sm:block">Logout ({{ userStore.getLoggedInUser?.username }})</span>
        </button>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="w-16 bg-gray-800 flex flex-col items-center py-35 space-y-15 text-gray-300 fixed left-0 top-16 h-full pt-20"> 
      <!-- Tautan umum untuk role 'user' atau jika belum login (untuk browsing) -->
      <template v-if="userStore.getLoggedInUser?.role === 'user' || !userStore.isLoggedIn">
        <RouterLink to="/home" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
          <Home class="w-6 h-6" />
          <span>Home</span>
        </RouterLink>
        <RouterLink to="/favorit" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
          <Heart class="w-6 h-6" />
          <span>Favorit</span>
        </RouterLink>
        <RouterLink to="/kategori" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
          <Utensils class="w-6 h-6" />
          <span>Kategori</span>
        </RouterLink>
        <RouterLink to="/bahan" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
          <List class="w-6 h-6" />
          <span>Bahan</span>
        </RouterLink>
        <RouterLink to="/shop" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
          <ShoppingCart class="w-6 h-6" />
          <span>Toko</span>
        </RouterLink>
      </template>

      <!-- Link Dashboard Kurir (hanya tampil jika user adalah courier) -->
      <RouterLink v-if="userStore.getLoggedInUser?.role === 'courier'" to="/courier-dashboard" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
        <Truck class="w-6 h-6" /> 
        <span>Kurir</span>
      </RouterLink>

      <!-- Link Dashboard Admin (hanya tampil jika user adalah admin) -->
      <RouterLink v-if="userStore.getLoggedInUser?.role === 'admin'" to="/admin-dashboard" class="flex flex-col items-center space-y-1 text-xs hover:text-white">
        <Settings class="w-6 h-6" /> 
        <span>Admin</span>
      </RouterLink>

    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 mt-20 ml-16"> 
      <RouterView />
    </main>

  </div>
</template>
