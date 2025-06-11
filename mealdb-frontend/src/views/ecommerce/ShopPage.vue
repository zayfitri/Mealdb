<template>
  <div class="container mx-auto p-4 md:p-6 lg:p-8 mt-16">
    <div class="bg-orange-100 p-6 text-center rounded-lg shadow-md mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-purple-700">Daftar Produk Toko 🛒</h1>
      <p class="text-gray-600 mt-2">Temukan bahan makanan dan peralatan dapur terbaik untuk resep Anda!</p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-48 text-gray-600">
      <p>Memuat produk...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">Gagal memuat produk: {{ error.message }}</span>
    </div>

    <div v-else-if="products.length === 0" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Informasi!</strong>
      <span class="block sm:inline">Belum ada produk yang tersedia saat ini.</span>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id"
           @click="goToProductDetail(product.id)"
           class="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-[1.01] hover:ring-4 hover:ring-purple-800/40">
        <figure>
          <img :src="getIngredientImageUrl(product.name)" :alt="product.name"
               class="w-full h-40 object-contain object-center border-b border-gray-200 p-4">
        </figure>
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-900 truncate mb-2">{{ product.name }}</h2>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
          
          <div class="flex justify-between items-center mt-4">
            <span class="text-yellow-600 font-bold text-xl">Rp{{ product.price.toLocaleString('id-ID') }}</span>
            <button @click.stop="addItemToCart(product)"
                    class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 cursor-pointer">
              Tambah
            </button>
          </div>
          <p class="text-gray-500 text-xs mt-2">Stok: {{ product.stock }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart'; // Import cart store

const router = useRouter();
const cartStore = useCartStore(); // Inisialisasi cart store

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string; // Tambahkan imageUrl
}

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

const getIngredientImageUrl = (ingredientName: string): string => {
  const formattedName = ingredientName.replace(/ /g, '%20'); 
  return `https://www.themealdb.com/images/ingredients/${formattedName}.png`;
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    const dummyProducts: Product[] = [
      { id: 'p1', name: 'Chicken', description: 'Daging ayam segar, siap diolah jadi berbagai masakan.', price: 45000, stock: 30, imageUrl: getIngredientImageUrl('Chicken') },
      { id: 'p2', name: 'Eggs', description: 'Telur ayam negeri berkualitas.', price: 25000, stock: 100, imageUrl: getIngredientImageUrl('Eggs') },
      { id: 'p3', name: 'Onion', description: 'Bawang bombay besar, cocok untuk tumisan dan sup.', price: 10000, stock: 75, imageUrl: getIngredientImageUrl('Onion') },
      { id: 'p4', name: 'Garlic', description: 'Bawang putih segar, bumbu dasar wajib.', price: 8000, stock: 120, imageUrl: getIngredientImageUrl('Garlic') },
      { id: 'p5', name: 'Potatoes', description: 'Kentang segar untuk sup, gorengan, atau mashed potato.', price: 18000, stock: 60, imageUrl: getIngredientImageUrl('Potatoes') },
      { id: 'p6', name: 'Sugar', description: 'Gula pasir putih, kebutuhan dasar dapur.', price: 13000, stock: 80, imageUrl: getIngredientImageUrl('Sugar') },
      { id: 'p7', name: 'Flour', description: 'Tepung terigu serbaguna, untuk kue dan roti.', price: 12000, stock: 90, imageUrl: getIngredientImageUrl('Flour') },
      { id: 'p8', name: 'Salt', description: 'Garam dapur beryodium.', price: 3000, stock: 150, imageUrl: getIngredientImageUrl('Salt') },
      { id: 'p9', name: 'Milk', description: 'Susu UHT full cream.', price: 22000, stock: 40, imageUrl: getIngredientImageUrl('Milk') },
      { id: 'p10', name: 'Butter', description: 'Mentega tawar untuk baking atau olesan roti.', price: 30000, stock: 25, imageUrl: getIngredientImageUrl('Butter') },
      { id: 'p11', name: 'Rice', description: 'Beras kualitas premium, pulen dan wangi.', price: 50000, stock: 70, imageUrl: getIngredientImageUrl('Rice') },
      { id: 'p12', name: 'Tomatoes', description: 'Tomat segar pilihan, kaya vitamin.', price: 9000, stock: 85, imageUrl: getIngredientImageUrl('Tomatoes') },
      { id: 'p13', name: 'Cheese', description: 'Keju cheddar block, cocok untuk berbagai hidangan.', price: 28000, stock: 35, imageUrl: getIngredientImageUrl('Cheese') },
      { id: 'p14', name: 'Pasta', description: 'Pasta spaghetti, cepat saji dan lezat.', price: 14000, stock: 95, imageUrl: getIngredientImageUrl('Pasta') },
      { id: 'p15', name: 'Olive Oil', description: 'Minyak zaitun extra virgin, sehat untuk memasak.', price: 60000, stock: 20, imageUrl: getIngredientImageUrl('Olive Oil') },
      { id: 'p16', name: 'Mushrooms', description: 'Jamur kancing segar, penambah rasa umami.', price: 16000, stock: 55, imageUrl: getIngredientImageUrl('Mushrooms') },
      { id: 'p17', name: 'Lemon', description: 'Lemon segar, sumber vitamin C dan aroma.', price: 7000, stock: 70, imageUrl: getIngredientImageUrl('Lemon') },
      { id: 'p18', name: 'Honey', description: 'Madu murni alami, baik untuk kesehatan.', price: 40000, stock: 28, imageUrl: getIngredientImageUrl('Honey') },
      { id: 'p19', name: 'Spinach', description: 'Bayam segar, sayuran hijau bergizi.', price: 5000, stock: 110, imageUrl: getIngredientImageUrl('Spinach') },
      { id: 'p20', name: 'Black Pepper', description: 'Lada hitam bubuk, bumbu penyedap masakan.', price: 10000, stock: 65, imageUrl: getIngredientImageUrl('Black Pepper') },
    ];
    products.value = dummyProducts;

  } catch (err) {
    console.error('Failed to fetch products:', err);
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
};

// Fungsi untuk menambahkan produk ke keranjang menggunakan Pinia
const addItemToCart = (product: Product) => {
  if (product.stock === 0) {
    alert(`Maaf, produk "${product.name}" sedang kosong.`);
    return;
  }
  cartStore.addToCart(product, 1); // Tambahkan 1 unit produk
  alert(`"${product.name}" berhasil ditambahkan ke keranjang.`);
};

const goToProductDetail = (id: string) => {
  router.push(`/product/${id}`);
};

onMounted(() => {
  fetchProducts();
});
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
