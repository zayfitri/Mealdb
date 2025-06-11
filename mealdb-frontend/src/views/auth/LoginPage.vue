<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-gray-200">
      <h1 class="text-3xl font-bold text-purple-700 text-center mb-6">Login Sistem</h1>
      <p class="text-gray-600 text-center mb-6">Pilih peran dan nama pengguna untuk simulasi login.</p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Nama Pengguna:</label>
          <input type="text" id="username" v-model="username"
                 class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300"
                 placeholder="Misal: pengguna_utama, kurir_cepat, admin_utama">
        </div>

        <div>
          <label for="role" class="block text-gray-700 text-sm font-bold mb-2">Login Sebagai:</label>
          <select id="role" v-model="role"
                  class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300">
            <option value="user">Pengguna (Pembeli/Penjual)</option>
            <option value="courier">Kurir</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit"
                class="w-full px-6 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
          Login
        </button>
      </form>

      <p v-if="userStore.isLoggedIn" class="text-center text-green-600 font-semibold mt-6">
        Anda sudah login sebagai: {{ userStore.getLoggedInUser?.username }} ({{ userStore.getLoggedInUser?.role }})
      </p>
      <button v-if="userStore.isLoggedIn" @click="handleLogout"
              class="w-full mt-4 px-6 py-3 bg-red-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-red-600 transition duration-300">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, UserRole } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// Pastikan inisialisasi default dari store, bukan string kosong
const username = ref(userStore.getLoggedInUser?.username || 'pengguna_utama'); // Default to a valid username for convenience
const role = ref<UserRole>(userStore.getLoggedInUser?.role || 'user'); // Default to 'user' for convenience

const handleLogin = () => {
  if (username.value && role.value) {
    console.log('LoginPage: Attempting login with:', { username: username.value, role: role.value });
    const success = userStore.login(username.value, role.value);
    if (success) {
      // alert('Login berhasil!'); // Notifikasi tambahan
      if (role.value === 'courier') {
        router.push('/courier-dashboard'); // Rute ini belum ada, tapi untuk placeholder
      } else if (role.value === 'admin') {
        router.push('/admin-dashboard'); // Rute ini belum ada
      } else { // Termasuk 'user'
        router.push('/user-dashboard');
      }
    } else {
        // Jika login gagal, alert sudah ditampilkan dari store
    }
  } else {
    alert('Nama pengguna dan peran harus diisi.');
  }
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Tidak ada styling khusus, Tailwind sudah mencukupi */
</style>
