<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div v-if="loading" class="flex justify-center items-center h-48 text-gray-600">
      <p>Memuat detail produk...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">Gagal memuat detail produk: {{ error.message }}</span>
    </div>

    <div v-else-if="!product" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Oops!</strong>
      <span class="block sm:inline">Produk tidak ditemukan.</span>
    </div>

    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-6 md:p-8">
      <button @click="router.back()"
              class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Kembali ke Toko
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
          <img :src="product.imageUrl" :alt="product.name"
               class="max-w-full h-auto object-contain max-h-80 rounded-lg shadow-sm">
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          
          <div class="flex items-baseline mb-4">
            <span class="text-yellow-600 font-bold text-3xl">Rp{{ product.price.toLocaleString('id-ID') }}</span>
          </div>

          <p class="text-gray-600 text-base mb-2">
            Stok Tersedia: 
            <span :class="{'font-semibold': true, 'text-green-600': product.stock > 10, 'text-orange-500': product.stock <= 10 && product.stock > 0, 'text-red-600': product.stock === 0}">
              {{ product.stock > 0 ? product.stock : 'Stok Kosong' }}
            </span>
          </p>

          <!-- Informasi Penjual -->
          <p class="text-gray-600 text-base mb-6">
            Dijual oleh: <span class="font-semibold text-purple-700">{{ product.sellerName }}</span>
          </p>

          <!-- Pemilih Kuantitas -->
          <div class="flex items-center mb-6">
            <label for="quantity" class="text-gray-700 mr-3 font-semibold">Kuantitas:</label>
            <input type="number" id="quantity" v-model.number="quantity"
                   min="1" :max="product.stock"
                   class="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-center"
                   @change="validateQuantity">
          </div>

          <button @click="addItemToCart(product, quantity)"
                  :disabled="product.stock === 0 || quantity === 0"
                  class="w-full px-6 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            Tambah ke Keranjang ({{ quantity }})
          </button>
        </div>
      </div>

      <!-- Deskripsi Produk Lengkap -->
      <div class="mt-10 pt-8 border-t border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Tentang Produk Ini</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ product.descriptionFull }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useProductStore, Product } from '@/stores/product'; // Import product store dan Product interface

const props = defineProps<{
  id: string; // ID produk dari URL
}>();

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore(); // Inisialisasi product store

// State reaktif
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const quantity = ref(1);

// Fungsi getIngredientImageUrl tidak lagi dibutuhkan di sini
// const getIngredientImageUrl = (ingredientName: string): string => {
//   const formattedName = ingredientName.replace(/ /g, '%20'); 
//   return `https://www.themealdb.com/images/ingredients/${formattedName}.png`;
// };

// Fungsi untuk memuat detail produk dari store
const fetchProductDetail = async (productId: string) => {
  loading.value = true;
  error.value = null;
  product.value = null;

  try {
    // Simulasi penundaan untuk user experience
    await new Promise(resolve => setTimeout(resolve, 300)); 

    const foundProduct = productStore.getProductById(productId); // Ambil dari store

    if (foundProduct) {
      product.value = foundProduct;
      if (foundProduct.stock === 0) {
        quantity.value = 0;
      } else {
        quantity.value = 1;
      }
    } else {
      throw new Error('Produk tidak ditemukan.');
    }
  } catch (err) {
    console.error('Failed to fetch product detail:', err);
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
};

const validateQuantity = () => {
  if (product.value) {
    if (quantity.value < 1) {
      quantity.value = 1;
    }
    if (quantity.value > product.value.stock) {
      quantity.value = product.value.stock;
    }
  }
};

const addItemToCart = (product: Product, qty: number) => {
  if (product.stock === 0) {
    alert(`Maaf, produk "${product.name}" sedang kosong.`);
    return;
  }
  if (qty === 0) {
    alert('Kuantitas tidak bisa nol.');
    return;
  }
  if (qty > product.stock) {
    alert(`Maaf, stok ${product.name} hanya tersedia ${product.stock}.`);
    return;
  }

  // Tambahkan imageUrl ke produk saat mengirim ke cart store
  cartStore.addToCart({ 
    id: product.id, 
    name: product.name, 
    price: product.price, 
    stock: product.stock, 
    imageUrl: product.imageUrl 
  }, qty);
  alert(`Produk "${product.name}" (${qty} unit) berhasil ditambahkan ke keranjang.`);
};

onMounted(() => {
  fetchProductDetail(props.id);
});

watch(() => props.id, (newId) => {
  if (newId) {
    fetchProductDetail(newId);
  }
}, { immediate: true });
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
