<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Keranjang Belanja Anda 🛍️</h1>
      <p class="text-gray-600 mt-2">Tinjau item Anda sebelum melanjutkan ke pembayaran.</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
      <strong class="font-bold">Keranjang Kosong!</strong>
      <span class="block sm:inline"> Belum ada produk di keranjang belanja Anda. <router-link to="/shop" class="text-blue-800 hover:underline">Mulai belanja sekarang!</router-link></span>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Daftar Item Keranjang -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Detail Pesanan</h2>
        <div v-for="item in cartStore.items" :key="item.productId"
             class="flex items-center border-b border-gray-200 py-4 last:border-b-0">
          
          <img :src="item.imageUrl" :alt="item.name"
               class="w-20 h-20 object-contain rounded-lg mr-4 border border-gray-100">
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm">Rp{{ item.price.toLocaleString('id-ID') }} per unit</p>
          </div>
          
          <div class="flex items-center space-x-2 mr-4">
            <button @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              -
            </button>
            <input type="number" :value="item.quantity"
                   @change="event => cartStore.updateQuantity(item.productId, parseInt((event.target as HTMLInputElement).value))"
                   min="1" :max="item.stock"
                   class="w-16 text-center border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300">
            <button @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
                    :disabled="item.quantity >= item.stock"
                    class="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              +
            </button>
          </div>

          <div class="text-right">
            <p class="text-lg font-bold text-yellow-600">Rp{{ (item.price * item.quantity).toLocaleString('id-ID') }}</p>
            <button @click="cartStore.removeFromCart(item.productId)"
                    class="text-red-500 hover:text-red-700 text-sm mt-1">Hapus</button>
          </div>
        </div>

        <button @click="cartStore.clearCart()"
                v-if="cartStore.items.length > 0"
                class="mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
          Bersihkan Keranjang
        </button>
      </div>

      <!-- Ringkasan Pesanan -->
      <div class="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 border border-gray-200 h-fit sticky top-20">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Ringkasan</h2>
        <div class="flex justify-between items-center mb-3 text-lg">
          <span>Subtotal ({{ cartStore.totalItems }} item):</span>
          <span class="font-semibold">Rp{{ cartStore.subtotal.toLocaleString('id-ID') }}</span>
        </div>
        <div class="flex justify-between items-center mb-6 text-lg font-bold text-purple-700">
          <span>Total:</span>
          <span>Rp{{ cartStore.subtotal.toLocaleString('id-ID') }}</span> <!-- Untuk demo, total sama dengan subtotal -->
        </div>

        <button @click="goToCheckout"
                class="w-full px-6 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'; // Import cart store
import { useRouter } from 'vue-router';

const cartStore = useCartStore(); // Inisialisasi cart store
const router = useRouter();

const goToCheckout = () => {
  // Logic untuk navigasi ke halaman checkout
  if (cartStore.items.length === 0) {
    alert('Keranjang Anda kosong. Tambahkan produk sebelum checkout.');
    return;
  }
  router.push('/checkout'); // Akan dibuat di langkah selanjutnya
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
/* Menyesuaikan posisi sticky untuk ringkasan di desktop */
@media (min-width: 1024px) {
  .lg\:col-span-1.sticky {
    top: 6rem; /* Sesuaikan dengan tinggi navbar Anda (sekitar 4rem) + sedikit margin */
  }
}
</style>
