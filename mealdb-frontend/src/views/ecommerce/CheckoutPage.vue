<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Pembayaran Pesanan 💳</h1>
      <p class="text-gray-600 mt-2">Lanjutkan pembayaran untuk menyelesaikan pesanan Anda.</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center">
      <strong class="font-bold">Keranjang Kosong!</strong>
      <span class="block sm:inline"> Tidak ada item untuk dibayar. <router-link to="/shop" class="text-blue-800 hover:underline">Mulai belanja sekarang!</router-link></span>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Ringkasan Pesanan -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>
        <div v-for="item in cartStore.items" :key="item.productId"
             class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <span class="text-gray-700">{{ item.name }} ({{ item.quantity }}x)</span>
          <span class="font-semibold text-gray-800">Rp{{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
        </div>
        
        <div class="flex justify-between items-center mt-6 pt-4 border-t-2 border-purple-200 text-xl font-bold text-purple-700">
          <span>Total Pembayaran:</span>
          <span>Rp{{ cartStore.subtotal.toLocaleString('id-ID') }}</span>
        </div>
      </div>

      <!-- Detail Pembayaran -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Metode Pembayaran</h2>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Uang Elektronik Anda
          </label>
          <div class="flex items-center justify-between p-3 border-2 border-purple-300 rounded-lg bg-purple-50 text-purple-800 font-semibold text-lg">
            <span>Saldo:</span>
            <span>Rp{{ walletStore.getBalance.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <div v-if="paymentError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong class="font-bold">Gagal Pembayaran!</strong>
          <span class="block sm:inline"> {{ paymentError }}</span>
        </div>

        <button @click="processPayment"
                :disabled="isProcessingPayment || cartStore.subtotal === 0"
                class="w-full px-6 py-3 bg-yellow-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isProcessingPayment">Memproses Pembayaran...</span>
          <span v-else>Bayar Sekarang Rp{{ cartStore.subtotal.toLocaleString('id-ID') }}</span>
        </button>

        <p class="text-center text-gray-500 text-sm mt-4">
          Seluruh transaksi menggunakan uang elektronik yang disediakan sistem. Tidak ada pembayaran COD.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useWalletStore } from '@/stores/wallet';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user'; // Import user store

const router = useRouter();
const cartStore = useCartStore();
const walletStore = useWalletStore();
const orderStore = useOrderStore();
const userStore = useUserStore(); // Inisialisasi user store

const isProcessingPayment = ref(false);
const paymentError = ref<string | null>(null);

const processPayment = async () => {
  if (isProcessingPayment.value) return;
  if (cartStore.items.length === 0) {
    alert('Keranjang Anda kosong. Tidak ada yang perlu dibayar.');
    router.push('/shop');
    return;
  }

  // Pastikan ada user yang login (simulasi)
  const currentUserId = userStore.getLoggedInUser?.id;
  if (!currentUserId) {
    alert('Anda harus login untuk melakukan pembayaran.');
    router.push('/login'); // Arahkan ke halaman login (akan dibuat nanti)
    return;
  }

  isProcessingPayment.value = true;
  paymentError.value = null;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const totalAmount = cartStore.subtotal;

    const paymentSuccessful = walletStore.deductBalance(totalAmount);

    if (paymentSuccessful) {
      console.log('Pembayaran berhasil!');
      alert('Pembayaran berhasil! Pesanan Anda sedang diproses.');
      
      // Tambahkan pesanan ke order store dengan ID pengguna yang sebenarnya
      orderStore.addOrder(cartStore.items, totalAmount, currentUserId); 
      
      cartStore.clearCartOnCheckout(); 
      
      router.push('/user-dashboard'); 
    } else {
      paymentError.value = 'Saldo uang elektronik tidak cukup. Silakan top-up saldo Anda.';
      alert(paymentError.value);
    }
  } catch (err) {
    console.error('Error during payment:', err);
    paymentError.value = 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.';
    alert(paymentError.value);
  } finally {
    isProcessingPayment.value = false;
  }
};

onMounted(() => {
  // Jika keranjang kosong DAN user belum login (nantinya), bisa redirect ke login
  if (cartStore.items.length === 0) {
    router.replace('/shop');
  }
});
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
