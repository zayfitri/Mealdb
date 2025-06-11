<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Dashboard Pengguna 👋</h1>
      <p class="text-gray-600 mt-2">Kelola akun dan pesanan Anda di sini.</p>
    </div>

    <!-- Informasi Saldo Uang Elektronik -->
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Uang Elektronik Anda</h2>
      <div class="flex items-center justify-between p-4 border-2 border-purple-300 rounded-lg bg-purple-50 text-purple-800 font-semibold text-xl">
        <span>Saldo Anda:</span>
        <span>Rp{{ walletStore.getBalance.toLocaleString('id-ID') }}</span>
      </div>
      <p class="text-gray-500 text-sm mt-2">Top-up dan tarik dana dilakukan secara manual di luar sistem.</p>
    </div>

    <!-- Daftar Pesanan Pembelian -->
    <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Saya</h2>
      
      <div v-if="userOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
        <strong class="font-bold">Belum Ada Pesanan!</strong>
        <span class="block sm:inline"> Anda belum melakukan pembelian. <router-link to="/shop" class="text-blue-800 hover:underline">Mulai belanja sekarang!</router-link></span>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in userOrders" :key="order.id"
             class="border border-gray-200 rounded-lg p-4 shadow-sm">
          <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
            <div>
              <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
              <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
            </div>
            <div>
              <span :class="getStatusBadgeClass(order.status)">
                {{ order.status.toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div v-for="item in order.items" :key="item.productId" class="flex items-center">
              <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 object-contain rounded mr-3 border border-gray-100">
              <div>
                <p class="font-semibold text-gray-800">{{ item.name }}</p>
                <p class="text-sm text-gray-600">{{ item.quantity }} x Rp{{ item.price.toLocaleString('id-ID') }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <span class="text-lg font-bold text-purple-700">Total: Rp{{ order.totalAmount.toLocaleString('id-ID') }}</span>
            
            <button v-if="order.status === 'sampai di tujuan' && !order.buyerReceivedConfirmed"
                    @click="confirmReceiveOrder(order.id)"
                    class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
              Konfirmasi Diterima
            </button>
            <span v-else-if="order.buyerReceivedConfirmed" class="text-green-600 font-semibold text-sm">
              Sudah Diterima Pembeli
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { useOrderStore, OrderStatus } from '@/stores/order'; // Import OrderStatus

const walletStore = useWalletStore();
const orderStore = useOrderStore();

// Untuk simulasi, kita akan menggunakan 'dummy-user-id'.
// Nantinya, ini akan diganti dengan ID pengguna yang sebenarnya dari store autentikasi.
const currentUserId = 'dummy-user-id'; 

// Dapatkan pesanan pengguna saat ini
const userOrders = computed(() => orderStore.getOrdersByUserId(currentUserId));

// Fungsi untuk mendapatkan kelas badge status
const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case 'menunggu penjual':
    case 'menunggu kurir':
      return 'bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'diproses penjual':
    case 'sedang dikirim':
      return 'bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'sampai di tujuan':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'diterima pembeli':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
    case 'dikomplain':
    case 'dikirim balik':
    case 'transaksi gagal':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
};

// Fungsi untuk mengkonfirmasi penerimaan pesanan
const confirmReceiveOrder = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin mengkonfirmasi bahwa pesanan ini sudah diterima?')) {
    orderStore.updateOrderStatus(orderId, 'diterima pembeli');
    alert('Pesanan berhasil dikonfirmasi diterima!');
    // Nantinya: Tambahkan logika untuk menambah saldo penjual di sini
    // Ini akan membutuhkan akses ke data penjual dan order store yang lebih kompleks
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
