<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Daftar Produk Toko 🛒</h1>
      <p class="text-gray-600 mt-2">Temukan bahan makanan dan peralatan dapur terbaik untuk resep Anda!</p>
    </div>

    <!-- Hapus bagian loading/error/no products karena data sudah dimuat via store -->
    <!-- Atau sesuaikan logika loading/error jika productStore memiliki state loading/error sendiri -->
    
    <div v-if="productStore.getAllProducts.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Informasi!</strong>
      <span class="block sm:inline">Belum ada produk yang tersedia saat ini.</span>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in productStore.getAllProducts" :key="product.id"
           @click="goToProductDetail(product.id)"
           class="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-[1.01] hover:ring-4 hover:ring-purple-800/40">
        <figure>
          <img :src="product.imageUrl" :alt="product.name"
               class="w-full h-40 object-contain object-center border-b border-gray-200 p-4">
        </figure>
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-900 truncate mb-2">{{ product.name }}</h2>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
          
          <div class="flex justify-between items-center mt-4">
            <span class="text-yellow-600 font-bold text-xl">Rp{{ product.price.toLocaleString('id-ID') }}</span>
            <button @click.stop="addItemToCart(product)"
                    :disabled="product.stock === 0"
                    class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              Tambah
            </button>
          </div>
          <p class="text-gray-500 text-xs mt-2">Stok: {{ product.stock > 0 ? product.stock : 'Kosong' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; // Hapus 'onMounted' jika tidak ada fetch async
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useProductStore, Product } from '@/stores/product'; // Import product store dan Product interface

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore(); // Inisialisasi product store

// Tidak perlu ref products dan fetchProducts lagi, ambil langsung dari store
// const products = ref<Product[]>([]);
// const loading = ref(true);
// const error = ref<Error | null>(null);

// Fungsi getIngredientImageUrl tidak lagi dibutuhkan di sini karena URL sudah ada di store Product
// const getIngredientImageUrl = (ingredientName: string): string => {
//   const formattedName = ingredientName.replace(/ /g, '%20'); 
//   return `https://www.themealdb.com/images/ingredients/${formattedName}.png`;
// };

// Fungsi fetchProducts sudah tidak perlu di komponen, cukup di loadProducts di main.ts
// const fetchProducts = async () => { /* ... */ };

const addItemToCart = (product: Product) => {
  if (product.stock === 0) {
    alert(`Maaf, produk "${product.name}" sedang kosong.`);
    return;
  }
  // Tambahkan imageUrl ke produk saat mengirim ke cart store
  cartStore.addToCart({ 
    id: product.id, 
    name: product.name, 
    price: product.price, 
    stock: product.stock, 
    imageUrl: product.imageUrl 
  }, 1); 
  alert(`"${product.name}" berhasil ditambahkan ke keranjang.`);
};

const goToProductDetail = (id: string) => {
  router.push(`/product/${id}`);
};

// onMounted tidak lagi perlu memanggil fetchProducts di sini
// onMounted(() => {
//   fetchProducts();
// });
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

img {
  max-height: 120px;
  width: auto;
}
</style>
