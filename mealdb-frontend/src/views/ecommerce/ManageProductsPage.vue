<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Edit Produk ✏️</h1>
      <p class="text-gray-600 mt-2">Sunting detail produk Anda.</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-48 text-gray-600">
      <p>Memuat detail produk...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">Gagal memuat detail produk: {{ error.message }}</span>
    </div>

    <div v-else-if="!productForm.id" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Oops!</strong>
      <span class="block sm:inline">Produk tidak ditemukan atau tidak ada ID produk.</span>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <button @click="router.back()"
              class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Kembali ke Dashboard
      </button>

      <form @submit.prevent="submitUpdate" class="space-y-6">
        <div>
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama Produk:</label>
          <input type="text" id="name" v-model="productForm.name" required
                 class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300">
        </div>
        
        <div>
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Deskripsi Singkat:</label>
          <textarea id="description" v-model="productForm.description" required
                    class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300 h-24"></textarea>
        </div>

        <div>
          <label for="descriptionFull" class="block text-gray-700 text-sm font-bold mb-2">Deskripsi Lengkap:</label>
          <textarea id="descriptionFull" v-model="productForm.descriptionFull"
                    class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300 h-32"></textarea>
          <p class="text-gray-500 text-xs mt-1">Opsional, deskripsi yang lebih detail untuk halaman produk.</p>
        </div>

        <div>
          <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Harga (Rp):</label>
          <input type="number" id="price" v-model.number="productForm.price" required min="0"
                 class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300">
        </div>

        <div>
          <label for="stock" class="block text-gray-700 text-sm font-bold mb-2">Stok:</label>
          <input type="number" id="stock" v-model.number="productForm.stock" required min="0"
                 class="shadow appearance-none border-2 border-purple-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300">
        </div>

        <button type="submit"
                class="w-full px-6 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition duration-300">
          Simpan Perubahan
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore, type Product } from '@/stores/product';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const userStore = useUserStore();

const loading = ref(true);
const error = ref<Error | null>(null);
const productForm = ref<Partial<Product>>({ // Gunakan Partial karena mungkin tidak semua properti ada saat inisialisasi
  id: '',
  name: '',
  description: '',
  descriptionFull: '',
  price: 0,
  stock: 0,
  sellerId: '',
  sellerName: '',
  imageUrl: '',
  status: 'stok tersedia', // Default status
});

const productId = computed(() => route.query.id as string);

const fetchProductToEdit = () => {
  loading.value = true;
  error.value = null;
  const product = productStore.getProductById(productId.value);
  const currentUser = userStore.getLoggedInUser;

  // Cek apakah produk ditemukan dan apakah pengguna yang login adalah pemilik produk
  if (!product || !currentUser || product.sellerId !== currentUser.id) {
    error.value = new Error('Produk tidak ditemukan atau Anda tidak memiliki izin untuk mengedit produk ini.');
    router.replace('/user-dashboard?tab=my-products'); // Redirect ke dashboard tab produk saya
    loading.value = false;
    return;
  }

  // Isi form dengan data produk yang ada
  productForm.value = { ...product }; // Salin data produk
  loading.value = false;
};

const submitUpdate = () => {
  // Validasi form
  if (productForm.value.name?.trim() === '' || productForm.value.description?.trim() === '' || (productForm.value.price || 0) <= 0 || (productForm.value.stock || 0) < 0) {
    alert('Mohon lengkapi semua bidang yang wajib dan pastikan harga/stok valid.');
    return;
  }

  if (productForm.value.id) { // Pastikan ID ada sebelum memperbarui
    productStore.updateProduct(productForm.value as Product); // Cast ke Product karena kita tahu field-nya lengkap
    alert('Produk berhasil diperbarui!');
    router.push('/user-dashboard?tab=my-products'); // Kembali ke dashboard tab produk saya
  } else {
    alert('Gagal memperbarui produk: ID produk tidak ditemukan.');
  }
};

onMounted(() => {
  if (productId.value) {
    fetchProductToEdit();
  } else {
    error.value = new Error('Tidak ada ID produk yang disediakan untuk diedit.');
    loading.value = false;
  }
});

// Watch for changes in productId jika navigasi langsung melalui query URL (misal: refresh halaman)
watch(productId, (newId) => {
  if (newId) {
    fetchProductToEdit();
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
