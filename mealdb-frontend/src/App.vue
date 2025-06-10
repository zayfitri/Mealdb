<script setup>
import { Home, Heart, Utensils, List } from 'lucide-vue-next';
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Navbar Global -->
    <div class="bg-yellow-500 p-4 flex items-center w-full fixed top-0 left-0 z-50">
      <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12 rounded-full" />
    </div>

    <!-- Sidebar -->
    <aside class="w-16 bg-gray-800 flex flex-col items-center py-35 space-y-15 text-gray-300 fixed left-0 top-16 h-full">
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
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 mt-5 ml-16">
      <RouterView />
    </main>

  </div>
</template>
