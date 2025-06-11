<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Dashboard Pengguna 👋</h1>
      <p class="text-gray-600 mt-2">Kelola akun, pesanan, dan penjualan Anda di sini.</p>
      <p v-if="userStore.getLoggedInUser" class="text-gray-700 text-lg mt-2">
        Selamat datang, <span class="font-semibold">{{ userStore.getLoggedInUser.username }}</span>!
      </p>
    </div>

    <!-- Peringatan Login -->
    <div v-if="!userStore.isLoggedIn" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 text-center">
      <strong class="font-bold">Anda Belum Login!</strong>
      <span class="block sm:inline"> Silakan <router-link to="/login" class="text-red-800 hover:underline">login</router-link> untuk melihat dashboard Anda.</span>
    </div>

    <div v-else>
      <!-- TABS untuk navigasi antar bagian dashboard pengguna -->
      <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button @click="activeTab = 'account'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'account' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Akun & Saldo
        </button>
        <button @click="activeTab = 'my-orders'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'my-orders' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Pesanan Saya (Pembeli)
        </button>
        <button @click="activeTab = 'my-products'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'my-products' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Produk Jualan Saya
        </button>
        <button @click="activeTab = 'sales-orders'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'sales-orders' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Pesanan Penjualan Masuk
        </button>
      </div>

      <!-- Konten Tab Akun & Saldo -->
      <div v-if="activeTab === 'account'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Informasi Akun</h2>
        <p class="text-gray-700 mb-2"><strong>ID Pengguna:</strong> {{ userStore.getLoggedInUser?.id }}</p>
        <p class="text-gray-700 mb-2"><strong>Nama Pengguna:</strong> {{ userStore.getLoggedInUser?.username }}</p>
        <p class="text-gray-700 mb-4"><strong>Email:</strong> {{ userStore.getLoggedInUser?.email }}</p>
        <p class="text-gray-700 mb-4"><strong>Peran:</strong> {{ userStore.getLoggedInUser?.role }}</p>

        <h2 class="text-2xl font-bold text-gray-800 mb-4">Uang Elektronik Anda</h2>
        <div class="flex items-center justify-between p-4 border-2 border-purple-300 rounded-lg bg-purple-50 text-purple-800 font-semibold text-xl">
          <span>Saldo Anda:</span>
          <span>Rp{{ walletStore.getBalance.toLocaleString('id-ID') }}</span>
        </div>
        <p class="text-gray-500 text-sm mt-2">Top-up dan tarik dana dilakukan secara manual di luar sistem.</p>
      </div>

      <!-- Konten Tab Pesanan Saya (Pembeli) -->
      <div v-if="activeTab === 'my-orders'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Saya (Pembelian)</h2>
        
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

      <!-- Konten Tab Produk Jualan Saya -->
      <div v-if="activeTab === 'my-products'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Produk Jualan Saya</h2>
        <router-link to="/user-dashboard/add-product"
                     class="inline-block px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 mb-4">
          + Tambah Produk Baru
        </router-link>

        <div v-if="myProducts.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Belum Ada Produk!</strong>
          <span class="block sm:inline"> Anda belum menambahkan produk apapun.</span>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">Produk</th>
                <th class="py-3 px-6 text-left">Harga</th>
                <th class="py-3 px-6 text-center">Stok</th>
                <th class="py-3 px-6 text-center">Status</th>
                <th class="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr v-for="product in myProducts" :key="product.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="product.imageUrl" :alt="product.name" class="w-10 h-10 object-contain rounded-full mr-3 border border-gray-100">
                    <span class="font-medium">{{ product.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-6 text-left">Rp{{ product.price.toLocaleString('id-ID') }}</td>
                <td class="py-3 px-6 text-center">
                  <span :class="{'font-semibold': true, 'text-green-600': product.stock > 10, 'text-orange-500': product.stock <= 10 && product.stock > 0, 'text-red-600': product.stock === 0}">
                    {{ product.stock > 0 ? product.stock : 'Kosong' }}
                  </span>
                </td>
                <td class="py-3 px-6 text-center">
                  <span :class="getStatusBadgeClass(product.status)">
                    {{ product.status.toUpperCase() }}
                  </span>
                </td>
                <td class="py-3 px-6 text-center">
                  <div class="flex item-center justify-center space-x-2">
                    <button @click="editProduct(product.id)" 
                            class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center transition">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button @click="deleteProduct(product.id)" 
                            class="w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center transition">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Konten Tab Pesanan Penjualan Masuk -->
      <div v-if="activeTab === 'sales-orders'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Penjualan Masuk</h2>
        
        <div v-if="mySalesOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Tidak Ada Pesanan Masuk!</strong>
          <span class="block sm:inline"> Anda belum memiliki pesanan penjualan.</span>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in mySalesOrders" :key="order.id"
               class="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
                <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
                <p class="text-gray-500 text-sm">Pembeli: <span class="font-semibold text-gray-700">{{ getUserDisplayName(order.userId) }}</span></p>
              </div>
              <div>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ order.status.toUpperCase() }}
                </span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <div v-for="item in order.items.filter(item => item.sellerId === userStore.getLoggedInUser?.id)" :key="item.productId" class="flex items-center">
                <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 object-contain rounded mr-3 border border-gray-100">
                <div>
                  <p class="font-semibold text-gray-800">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">{{ item.quantity }} x Rp{{ item.price.toLocaleString('id-ID') }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
              <span class="text-lg font-bold text-purple-700">Total untuk Anda: Rp{{ calculateSellerRevenue(order).toLocaleString('id-ID') }}</span>
              
              <div class="flex space-x-2">
                <button v-if="order.status === 'menunggu penjual'"
                        @click="processOrder(order.id)"
                        class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
                  Proses Pesanan
                </button>
                <button v-if="order.status === 'diproses penjual'"
                        @click="callCourier(order.id)"
                        class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                  Panggil Kurir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useProductStore, type Product } from '@/stores/product';
import { useOrderStore, OrderStatus, type Order } from '@/stores/order';
import { useWalletStore } from '@/stores/wallet'; // <--- PASTIKAN INI DIIMPORT

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const productStore = useProductStore();
const orderStore = useOrderStore();
const walletStore = useWalletStore(); // <--- PASTIKAN INI DIINISIALISASI

const activeTab = ref(route.query.tab as string || 'account');

const userOrders = computed(() => {
  const userId = userStore.getLoggedInUser?.id;
  return userId ? orderStore.getOrdersByUserId(userId) : [];
});

const myProducts = computed<Product[]>(() => {
  const userId = userStore.getLoggedInUser?.id;
  if (userId) {
    return productStore.getProductsBySellerId(userId);
  }
  return [];
});

const mySalesOrders = computed(() => {
  const userId = userStore.getLoggedInUser?.id;
  if (userId) {
    return orderStore.getOrdersForSeller(userId).filter(order =>
        ['menunggu penjual', 'diproses penjual', 'menunggu kurir', 'dikirim balik'].includes(order.status)
    );
  }
  return [];
});

const calculateSellerRevenue = (order: Order) => {
    const userId = userStore.getLoggedInUser?.id;
    if (!userId) return 0;
    
    return order.items.reduce((total, item) => {
        if (item.sellerId === userId) {
            return total + (item.price * item.quantity);
        }
        return total;
    }, 0);
};

const getUserDisplayName = (userId: string) => {
    const user = userStore.getUserById(userId);
    return user ? user.username : 'Pengguna Tidak Dikenal';
};

const getStatusBadgeClass = (status: OrderStatus | 'stok tersedia' | 'stok kosong') => {
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
    case 'stok tersedia':
      return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold';
    case 'stok kosong':
      return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold';
  }
};

const editProduct = (productId: string) => {
  router.push(`/user-dashboard/manage-products?id=${productId}`);
};

const deleteProduct = (productId: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini? Stok akan dikembalikan jika ada transaksi yang masih terkait.')) {
    productStore.deleteProduct(productId);
    alert('Produk berhasil dihapus!');
  }
};

const confirmReceiveOrder = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin mengkonfirmasi bahwa pesanan ini sudah diterima?')) {
    orderStore.updateOrderStatus(orderId, 'diterima pembeli');
    alert('Pesanan berhasil dikonfirmasi diterima!');
  }
};

const processOrder = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin memproses pesanan ini?')) {
    orderStore.updateOrderStatus(orderId, 'diproses penjual');
    alert('Pesanan berhasil diproses!');
  }
};

const callCourier = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin memanggil kurir untuk pesanan ini?')) {
    orderStore.updateOrderStatus(orderId, 'menunggu kurir');
    alert('Kurir berhasil dipanggil! Pesanan akan segera dijemput.');
  }
};

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab as string;
  }
}, { immediate: true });
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
