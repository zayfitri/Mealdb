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
          <img :src="getIngredientImageUrl(product.name)" :alt="product.name"
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

          <p class="text-gray-600 text-base mb-6">
            Dijual oleh: <span class="font-semibold text-purple-700">{{ product.sellerName }}</span>
          </p>

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
import { useCartStore } from '@/stores/cart'; // Import cart store

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const cartStore = useCartStore(); // Inisialisasi cart store

interface Product {
  id: string;
  name: string;
  description: string;
  descriptionFull: string;
  price: number;
  stock: number;
  sellerName: string;
  imageUrl: string; // Tambahkan imageUrl
}

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const quantity = ref(1);

const getIngredientImageUrl = (ingredientName: string): string => {
  const formattedName = ingredientName.replace(/ /g, '%20'); 
  return `https://www.themealdb.com/images/ingredients/${formattedName}.png`;
};

const allDummyProducts: Product[] = [
  { 
    id: 'p1', 
    name: 'Chicken', 
    description: 'Daging ayam segar, siap diolah jadi berbagai masakan.', 
    descriptionFull: 'Daging ayam fillet tanpa tulang dan kulit, dipotong sempurna untuk kebutuhan masak Anda. Diperoleh dari peternakan terpercaya, bebas hormon, dan dijamin kesegarannya. Cocok untuk aneka resep ayam panggang, tumisan, sup, atau sebagai bahan dasar MPASI.',
    price: 45000, 
    stock: 30, 
    sellerName: 'Toko Segar Jaya',
    imageUrl: getIngredientImageUrl('Chicken') // Tambahkan imageUrl
  },
  { 
    id: 'p2', 
    name: 'Eggs', 
    description: 'Telur ayam negeri berkualitas.', 
    descriptionFull: 'Telur ayam negeri pilihan dengan ukuran sedang, kaya protein dan gizi. Cocok untuk digoreng, direbus, bahan kue, atau segala jenis masakan. Disimpan di suhu yang tepat untuk menjaga kesegarannya.',
    price: 25000, 
    stock: 100, 
    sellerName: 'Agro Makmur',
    imageUrl: getIngredientImageUrl('Eggs') // Tambahkan imageUrl
  },
  { 
    id: 'p3', 
    name: 'Onion', 
    description: 'Bawang bombay besar, cocok untuk tumisan dan sup.', 
    descriptionFull: 'Bawang bombay ukuran besar, memiliki aroma kuat dan rasa manis setelah dimasak. Ideal untuk base tumisan, sup, kari, atau caramelisasi. Dikirim dalam kondisi bersih dan kering.',
    price: 10000, 
    stock: 75, 
    sellerName: 'Sayuran Organik Bu Nita',
    imageUrl: getIngredientImageUrl('Onion') // Tambahkan imageUrl
  },
  { 
    id: 'p4', 
    name: 'Garlic', 
    description: 'Bawang putih segar, bumbu dasar wajib.', 
    descriptionFull: 'Bawang putih lokal segar, kaya akan manfaat kesehatan dan aroma khas yang kuat. Merupakan bumbu dasar penting di hampir semua masakan Indonesia dan internasional. Dikemas dalam kondisi terbaik.',
    price: 8000, 
    stock: 120, 
    sellerName: 'Bumbu Dapur Aji',
    imageUrl: getIngredientImageUrl('Garlic') // Tambahkan imageUrl
  },
  { 
    id: 'p5', 
    name: 'Potatoes', 
    description: 'Kentang segar untuk sup, gorengan, atau mashed potato.', 
    descriptionFull: 'Kentang dieng segar, tekstur padat, cocok untuk digoreng, direbus, maupun dibuat perkedel. Sumber karbohidrat yang baik dan mudah diolah.',
    price: 18000, 
    stock: 60, 
    sellerName: 'Petani Kita',
    imageUrl: getIngredientImageUrl('Potatoes') // Tambahkan imageUrl
  },
  { id: 'p6', name: 'Sugar', description: 'Gula pasir putih, kebutuhan dasar dapur.', descriptionFull: 'Gula pasir putih bersih dari tebu pilihan. Cocok untuk pemanis minuman, kue, dan masakan sehari-hari. Kemasan higienis dan terjamin kualitasnya.', price: 13000, stock: 80, sellerName: 'Grosir Sembako Jaya', imageUrl: getIngredientImageUrl('Sugar') },
  { id: 'p7', name: 'Flour', description: 'Tepung terigu serbaguna, untuk kue dan roti.', descriptionFull: 'Tepung terigu serbaguna dengan kualitas terbaik, cocok untuk membuat aneka kue, roti, gorengan, dan adonan lainnya. Hasil masakan lebih lembut dan mengembang sempurna.', price: 12000, stock: 90, sellerName: 'Bahan Kue Lestari', imageUrl: getIngredientImageUrl('Flour') },
  { id: 'p8', name: 'Salt', description: 'Garam dapur beryodium.', descriptionFull: 'Garam dapur beryodium halus, esensial untuk kesehatan tiroid. Cocok untuk bumbu masakan dan pengawetan makanan. Kemasan praktis dan mudah digunakan.', price: 3000, stock: 150, sellerName: 'Bumbu Nusantara', imageUrl: getIngredientImageUrl('Salt') },
  { id: 'p9', name: 'Milk', description: 'Susu UHT full cream.', descriptionFull: 'Susu UHT full cream rendah lemak, kaya kalsium dan vitamin. Cocok untuk diminum langsung, campuran kopi/teh, atau bahan dasar smoothies dan puding. Tersedia dalam kemasan praktis.', price: 22000, stock: 40, sellerName: 'Minuman Sehat Kita', imageUrl: getIngredientImageUrl('Milk') },
  { id: 'p10', name: 'Butter', description: 'Mentega tawar untuk baking atau olesan roti.', descriptionFull: 'Mentega tawar berkualitas tinggi, terbuat dari susu sapi asli. Ideal untuk baking, menumis, atau olesan roti. Memberikan aroma dan rasa gurih yang istimewa pada masakan Anda.', price: 30000, stock: 25, sellerName: 'Dunia Susu & Olahan', imageUrl: getIngredientImageUrl('Butter') },
  { id: 'p11', name: 'Rice', description: 'Beras kualitas premium, pulen dan wangi.', descriptionFull: 'Beras putih kualitas premium, hasil panen terbaik. Nasi pulen dengan aroma wangi yang menggugah selera. Cocok untuk hidangan sehari-hari keluarga Anda.', price: 50000, stock: 70, sellerName: 'Petani Makmur', imageUrl: getIngredientImageUrl('Rice') },
  { id: 'p12', name: 'Tomatoes', description: 'Tomat segar pilihan, kaya vitamin.', descriptionFull: 'Tomat segar pilihan, merah merona dan padat. Sumber vitamin C dan antioksidan alami. Sempurna untuk salad, saus, atau jus.', price: 9000, stock: 85, sellerName: 'Sayur Segar Bali', imageUrl: getIngredientImageUrl('Tomatoes') },
  { id: 'p13', name: 'Cheese', description: 'Keju cheddar block, cocok untuk berbagai hidangan.', descriptionFull: 'Keju cheddar block, rasa gurih dan tekstur lembut. Mudah diparut atau diiris, cocok untuk topping pasta, burger, atau camilan langsung.', price: 28000, stock: 35, sellerName: 'Dunia Keju', imageUrl: getIngredientImageUrl('Cheese') },
  { id: 'p14', name: 'Pasta', description: 'Pasta spaghetti, cepat saji dan lezat.', descriptionFull: 'Pasta spaghetti dari gandum durum pilihan, tekstur kenyal sempurna setelah dimasak. Cocok dipadukan dengan berbagai saus pasta kesukaan Anda.', price: 14000, stock: 95, sellerName: 'Italia Foods', imageUrl: getIngredientImageUrl('Pasta') },
  { id: 'p15', name: 'Olive Oil', description: 'Minyak zaitun extra virgin, sehat untuk memasak.', descriptionFull: 'Minyak zaitun extra virgin dari perasan pertama buah zaitun, kaya antioksidan dan lemak tak jenuh tunggal. Ideal untuk salad dressing, menumis ringan, atau sebagai dipping sauce.', price: 60000, stock: 20, sellerName: 'Healthy Living Store', imageUrl: getIngredientImageUrl('Olive Oil') },
  { id: 'p16', name: 'Mushrooms', description: 'Jamur kancing segar, penambah rasa umami.', descriptionFull: 'Jamur kancing segar pilihan, tekstur renyah dan rasa umami. Cocok untuk tumisan, sup, pizza, atau omelet. Sumber protein nabati yang baik.', price: 16000, stock: 55, sellerName: 'Petani Jamur Indah', imageUrl: getIngredientImageUrl('Mushrooms') },
  { id: 'p17', name: 'Lemon', description: 'Lemon segar, sumber vitamin C dan aroma.', descriptionFull: 'Lemon segar impor, kulit cerah dan air melimpah. Sumber vitamin C alami dan memberikan aroma segar pada masakan atau minuman.', price: 7000, stock: 70, sellerName: 'Buah Tropis', imageUrl: getIngredientImageUrl('Lemon') },
  { id: 'p18', name: 'Honey', description: 'Madu murni alami, baik untuk kesehatan.', descriptionFull: 'Madu murni alami dari nektar bunga pilihan, tanpa tambahan pengawet. Rasa manis alami dan kaya akan manfaat kesehatan. Cocok untuk pemanis alami atau campuran minuman.', price: 40000, stock: 28, sellerName: 'Madu Sehat Alami', imageUrl: getIngredientImageUrl('Honey') },
  { id: 'p19', name: 'Spinach', description: 'Bayam segar, sayuran hijau bergizi.', descriptionFull: 'Bayam segar organik, daun hijau pekat dan renyah. Kaya zat besi dan vitamin. Sempurna untuk tumisan, sup, atau jus hijau.', price: 5000, stock: 110, sellerName: 'Kebun Ibu', imageUrl: getIngredientImageUrl('Spinach') },
  { id: 'p20', name: 'Black Pepper', description: 'Lada hitam bubuk, bumbu penyedap masakan.', descriptionFull: 'Lada hitam bubuk murni, dengan aroma kuat dan rasa pedas yang khas. Ideal untuk membumbui daging, sayuran, atau saus. Menambah kehangatan pada setiap hidangan.', price: 10000, stock: 65, sellerName: 'Bumbu Warisan Nenek', imageUrl: getIngredientImageUrl('Black Pepper') },
];


const fetchProductDetail = async (productId: string) => {
  loading.value = true;
  error.value = null;
  product.value = null;

  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundProduct = allDummyProducts.find(p => p.id === productId);

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

// Ubah nama fungsi ini agar tidak bentrok dengan metode addToCart di store
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

  // Panggil aksi addToCart dari Pinia store
  cartStore.addToCart(product, qty);
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
