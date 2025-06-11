<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Dashboard Kurir 🚚</h1>
      <p class="text-gray-600 mt-2">Kelola pesanan yang perlu Anda antar atau kembalikan.</p>
      <p v-if="userStore.getLoggedInUser" class="text-gray-700 text-lg mt-2">
        Selamat datang, <span class="font-semibold">{{ userStore.getLoggedInUser.username }}</span>!
      </p>
      <!-- Tampilan Saldo Kurir -->
      <p v-if="userStore.getLoggedInUser" class="text-gray-700 text-lg font-semibold mt-2">
        Saldo Anda: Rp{{ walletStore.getBalanceByUserId(userStore.getLoggedInUser.id).toLocaleString('id-ID') }}
      </p>
    </div>

    <!-- Peringatan Akses Kurir -->
    <div v-if="!userStore.isLoggedIn || userStore.getLoggedInUser?.role !== 'courier'" 
         class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 text-center">
      <strong class="font-bold">Akses Ditolak!</strong>
      <span class="block sm:inline"> Anda tidak memiliki izin untuk mengakses halaman ini atau belum login sebagai kurir. Silakan <router-link to="/login" class="text-red-800 hover:underline">login</router-link> sebagai kurir.</span>
    </div>

    <div v-else>
      <!-- TABS untuk navigasi antar bagian pesanan kurir -->
      <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button @click="activeTab = 'pending-pickup'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'pending-pickup' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Menunggu Penjemputan
        </button>
        <button @click="activeTab = 'in-delivery'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'in-delivery' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Sedang Dikirim
        </button>
        <button @click="activeTab = 'returned'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'returned' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Dikirim Balik
        </button>
        <button @click="activeTab = 'all-courier-orders'"
                :class="['px-6 py-3 text-lg font-semibold border-b-2 whitespace-nowrap', 
                         activeTab === 'all-courier-orders' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-800']">
          Semua Pesanan Saya
        </button>
      </div>

      <!-- Konten Tab Menunggu Penjemputan -->
      <div v-if="activeTab === 'pending-pickup'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Menunggu Penjemputan</h2>
        
        <div v-if="pendingPickupOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Tidak Ada Pesanan!</strong>
          <span class="block sm:inline"> Belum ada pesanan yang menunggu penjemputan.</span>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in pendingPickupOrders" :key="order.id"
               class="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
                <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
                <p class="text-gray-500 text-sm">Pembeli: <span class="font-semibold text-gray-700">{{ getUserDisplayName(order.userId) }}</span></p>
                <p class="text-gray-500 text-sm">Penjual: 
                  <span class="font-semibold text-gray-700">
                    {{ getSellerNamesForOrder(order).join(', ') }}
                  </span>
                </p>
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
              
              <div class="flex space-x-2">
                <button @click="startDelivery(order.id)"
                        class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
                  Mulai Pengiriman
                </button>
                <button @click="markAsReturned(order.id)"
                        class="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                  Dikirim Balik
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten Tab Sedang Dikirim -->
      <div v-if="activeTab === 'in-delivery'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Sedang Dikirim</h2>
        
        <div v-if="inDeliveryOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Tidak Ada Pesanan!</strong>
          <span class="block sm:inline"> Belum ada pesanan yang sedang Anda kirim.</span>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in inDeliveryOrders" :key="order.id"
               class="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
                <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
                <p class="text-gray-500 text-sm">Pembeli: <span class="font-semibold text-gray-700">{{ getUserDisplayName(order.userId) }}</span></p>
                <p class="text-gray-500 text-sm">Penjual: 
                  <span class="font-semibold text-gray-700">
                    {{ getSellerNamesForOrder(order).join(', ') }}
                  </span>
                </p>
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
              
              <button @click="markAsArrived(order.id)"
                      class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300">
                Sampai di Tujuan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten Tab Dikirim Balik -->
      <div v-if="activeTab === 'returned'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Pesanan Dikirim Balik</h2>
        
        <div v-if="returnedOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Tidak Ada Pesanan!</strong>
          <span class="block sm:inline"> Belum ada pesanan yang dikirim balik.</span>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in returnedOrders" :key="order.id"
               class="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
                <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
                <p class="text-gray-500 text-sm">Pembeli: <span class="font-semibold text-gray-700">{{ getUserDisplayName(order.userId) }}</span></p>
                <p class="text-gray-500 text-sm">Penjual: 
                  <span class="font-semibold text-gray-700">
                    {{ getSellerNamesForOrder(order).join(', ') }}
                  </span>
                </p>
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
              
              <button @click="markAsReturnedToSeller(order.id)"
                      class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                Kembalikan ke Penjual
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten Tab Semua Pesanan Saya (untuk kurir) -->
      <div v-if="activeTab === 'all-courier-orders'" class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Semua Pesanan yang Saya Tangani</h2>
        
        <div v-if="allCourierOrders.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
          <strong class="font-bold">Tidak Ada Riwayat Pesanan!</strong>
          <span class="block sm:inline"> Anda belum memiliki riwayat pesanan yang ditangani.</span>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in allCourierOrders" :key="order.id"
               class="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <div>
                <p class="text-gray-500 text-sm">ID Pesanan: <span class="font-semibold text-gray-700">{{ order.id }}</span></p>
                <p class="text-gray-500 text-sm">Tanggal Pesan: {{ new Date(order.orderDate).toLocaleDateString('id-ID') }}</p>
                <p class="text-gray-500 text-sm">Pembeli: <span class="font-semibold text-gray-700">{{ getUserDisplayName(order.userId) }}</span></p>
                <p class="text-gray-500 text-sm">Penjual: 
                  <span class="font-semibold text-gray-700">
                    {{ getSellerNamesForOrder(order).join(', ') }}
                  </span>
                </p>
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
              <!-- Tombol aksi spesifik untuk kurir bisa ditempatkan di sini berdasarkan status -->
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { useUserStore } from '@/stores/user';
import { useOrderStore, OrderStatus, type Order } from '@/stores/order'; 
import { useWalletStore } from '@/stores/wallet'; // Import wallet store

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const walletStore = useWalletStore(); // Inisialisasi wallet store

const activeTab = ref('pending-pickup'); // Default tab untuk kurir

// Computed properties untuk memfilter pesanan berdasarkan status
const allCourierOrders = computed(() => {
  const userId = userStore.getLoggedInUser?.id;
  if (!userId) return [];
  // Kurir melihat pesanan yang pernah melewati status yang ia tangani
  // Untuk simulasi, kita filter berdasarkan status yang kurir tangani
  return orderStore.orders.filter(order =>
    ['menunggu kurir', 'sedang dikirim', 'sampai di tujuan', 'dikirim balik'].includes(order.status)
  );
});

const pendingPickupOrders = computed(() => {
  return allCourierOrders.value.filter(order => order.status === 'menunggu kurir');
});

const inDeliveryOrders = computed(() => {
  return allCourierOrders.value.filter(order => order.status === 'sedang dikirim');
});

const returnedOrders = computed(() => {
  return allCourierOrders.value.filter(order => order.status === 'dikirim balik');
});

// Fungsi untuk mendapatkan display name pengguna (pembeli/penjual)
const getUserDisplayName = (userId: string) => {
    const user = userStore.getUserById(userId);
    return user ? user.username : 'Pengguna Tidak Dikenal';
};

// Fungsi untuk mendapatkan nama penjual dari sebuah pesanan (karena bisa multi-penjual)
const getSellerNamesForOrder = (order: Order): string[] => {
    const uniqueSellerIds = new Set(order.items.map(item => item.sellerId));
    const sellerNames: string[] = [];
    uniqueSellerIds.forEach(sellerId => {
        const user = userStore.getUserById(sellerId);
        if (user) {
            sellerNames.push(user.username);
        } else {
            sellerNames.push('Penjual Tidak Dikenal');
        }
    });
    return sellerNames;
};

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

// Aksi Kurir: Mengubah status pesanan
const startDelivery = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin memulai pengiriman pesanan ini?')) {
    orderStore.updateOrderStatus(orderId, 'sedang dikirim');
    alert('Pesanan sedang dikirim!');
  }
};

const markAsReturned = (orderId: string) => {
  if (confirm('Apakah Anda yakin ingin menandai pesanan ini sebagai dikirim balik?')) {
    orderStore.updateOrderStatus(orderId, 'dikirim balik');
    alert('Pesanan ditandai sebagai dikirim balik!');
  }
};

const markAsArrived = (orderId: string) => {
  if (confirm('Apakah Anda yakin pesanan ini sudah sampai di tujuan?')) {
    orderStore.updateOrderStatus(orderId, 'sampai di tujuan');
    alert('Pesanan sudah sampai di tujuan!');
  }
};

const markAsReturnedToSeller = (orderId: string) => {
  if (confirm('Apakah Anda yakin pesanan ini sudah dikembalikan ke penjual?')) {
    orderStore.updateOrderStatus(orderId, 'menunggu penjual'); // Kembali ke penjual
    alert('Pesanan berhasil dikembalikan ke penjual!');
  }
};

// Opsional: Redirect jika user tidak memiliki peran kurir
onMounted(() => {
  if (!userStore.isLoggedIn || userStore.getLoggedInUser?.role !== 'courier') {
    // router.replace('/login'); // Atau ke home jika tidak diizinkan
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
