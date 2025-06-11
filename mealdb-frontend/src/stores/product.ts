// src/stores/product.ts
import { defineStore } from 'pinia';

export interface Product {
  id: string;
  name: string;
  description: string; // Deskripsi singkat
  descriptionFull: string; // Deskripsi lengkap
  price: number;
  stock: number; // Stok yang tersedia
  sellerId: string; // ID pengguna yang menjual produk ini
  sellerName: string; // Nama penjual
  imageUrl: string; // URL gambar produk (dari MealDB Ingredient Images)
  status: 'stok kosong' | 'stok tersedia'; // Status stok produk
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[], // Array untuk menyimpan semua produk
  }),
  getters: {
    getAllProducts(state): Product[] {
      return state.products;
    },
    getProductById: (state) => (productId: string): Product | undefined => {
      return state.products.find(product => product.id === productId);
    },
    getProductsBySellerId: (state) => (userId: string): Product[] => {
      return state.products.filter(product => product.sellerId === userId);
    },
  },
  actions: {
    // Pastikan fungsi saveProducts ada di sini, di dalam objek actions
    saveProducts() {
      localStorage.setItem('allProducts', JSON.stringify(this.products));
      console.log('Product Store: Products saved to localStorage.'); // DEBUG
    },

    loadProducts() {
      console.log('Product Store: Loading products...'); // DEBUG
      const savedProducts = localStorage.getItem('allProducts');
      if (savedProducts) {
        this.products = JSON.parse(savedProducts);
        console.log('Product Store: Products loaded from localStorage:', this.products); // DEBUG
      } else {
        // Dummy data produk awal jika belum ada di localStorage
        const dummyProducts: Product[] = [
          { id: 'p1', name: 'Chicken', description: 'Daging ayam segar, siap diolah jadi berbagai masakan.', descriptionFull: 'Daging ayam fillet tanpa tulang dan kulit, dipotong sempurna untuk kebutuhan masak Anda. Diperoleh dari peternakan terpercaya, bebas hormon, dan dijamin kesegarannya. Cocok untuk aneka resep ayam panggang, tumisan, sup, atau sebagai bahan dasar MPASI.', price: 45000, stock: 30, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Chicken.png', status: 'stok tersedia' },
          { id: 'p2', name: 'Eggs', description: 'Telur ayam negeri berkualitas.', descriptionFull: 'Telur ayam negeri pilihan dengan ukuran sedang, kaya protein dan gizi. Cocok untuk digoreng, direbus, bahan kue, atau segala jenis masakan. Disimpan di suhu yang tepat untuk menjaga kesegarannya.', price: 25000, stock: 100, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Eggs.png', status: 'stok tersedia' },
          { id: 'p3', name: 'Onion', description: 'Bawang bombay besar, cocok untuk tumisan dan sup.', descriptionFull: 'Bawang bombay ukuran besar, memiliki aroma kuat dan rasa manis setelah dimasak. Ideal untuk base tumisan, sup, kari, atau caramelisasi. Dikirim dalam kondisi bersih dan kering.', price: 10000, stock: 75, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Onion.png', status: 'stok tersedia' },
          { id: 'p4', name: 'Garlic', description: 'Bawang putih segar, bumbu dasar wajib.', descriptionFull: 'Bawang putih lokal segar, kaya akan manfaat kesehatan dan aroma khas yang kuat. Merupakan bumbu dasar penting di hampir semua masakan Indonesia dan internasional. Dikemas dalam kondisi terbaik.', price: 8000, stock: 120, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Garlic.png', status: 'stok tersedia' },
          { id: 'p5', name: 'Potatoes', description: 'Kentang segar untuk sup, gorengan, atau mashed potato.', descriptionFull: 'Kentang dieng segar, tekstur padat, cocok untuk digoreng, direbus, maupun dibuat perkedel. Sumber karbohidrat yang baik dan mudah diolah.', price: 18000, stock: 60, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Potatoes.png', status: 'stok tersedia' },
          { id: 'p6', name: 'Sugar', description: 'Gula pasir putih, kebutuhan dasar dapur.', descriptionFull: 'Gula pasir putih bersih dari tebu pilihan. Cocok untuk pemanis minuman, kue, dan masakan sehari-hari. Kemasan higienis dan terjamin kualitasnya.', price: 13000, stock: 80, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Sugar.png', status: 'stok tersedia' },
          { id: 'p7', name: 'Flour', description: 'Tepung terigu serbaguna, untuk kue dan roti.', descriptionFull: 'Tepung terigu serbaguna dengan kualitas terbaik, cocok untuk membuat aneka kue, roti, gorengan, dan adonan lainnya. Hasil masakan lebih lembut dan mengembang sempurna.', price: 12000, stock: 90, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Flour.png', status: 'stok tersedia' },
          { id: 'p8', name: 'Salt', description: 'Garam dapur beryodium.', descriptionFull: 'Garam dapur beryodium halus, esensial untuk kesehatan tiroid. Cocok untuk bumbu masakan dan pengawetan makanan. Kemasan praktis dan mudah digunakan.', price: 3000, stock: 150, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Salt.png', status: 'stok tersedia' },
          { id: 'p9', name: 'Milk', description: 'Susu UHT full cream.', descriptionFull: 'Susu UHT full cream rendah lemak, kaya kalsium dan vitamin. Cocok untuk diminum langsung, campuran kopi/teh, atau bahan dasar smoothies dan puding. Tersedia dalam kemasan praktis.', price: 22000, stock: 40, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Milk.png', status: 'stok tersedia' },
          { id: 'p10', name: 'Butter', description: 'Mentega tawar untuk baking atau olesan roti.', descriptionFull: 'Mentega tawar berkualitas tinggi, terbuat dari susu sapi asli. Ideal untuk baking, menumis, atau olesan roti. Memberikan aroma dan rasa gurih yang istimewa pada masakan Anda.', price: 30000, stock: 25, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Butter.png', status: 'stok tersedia' },
          { id: 'p11', name: 'Rice', description: 'Beras kualitas premium, pulen dan wangi.', descriptionFull: 'Beras putih kualitas premium, hasil panen terbaik. Nasi pulen dengan aroma wangi yang menggugah selera. Cocok untuk hidangan sehari-hari keluarga Anda.', price: 50000, stock: 70, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Rice.png', status: 'stok tersedia' },
          { id: 'p12', name: 'Tomatoes', description: 'Tomat segar pilihan, kaya vitamin.', descriptionFull: 'Tomat segar pilihan, merah merona dan padat. Sumber vitamin C dan antioksidan alami. Sempurna untuk salad, saus, atau jus.', price: 9000, stock: 85, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Tomatoes.png', status: 'stok tersedia' },
          { id: 'p13', name: 'Cheese', description: 'Keju cheddar block, cocok untuk berbagai hidangan.', descriptionFull: 'Keju cheddar block, rasa gurih dan tekstur lembut. Mudah diparut atau diiris, cocok untuk topping pasta, burger, atau camilan langsung.', price: 28000, stock: 35, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Cheese.png', status: 'stok tersedia' },
          { id: 'p14', name: 'Pasta', description: 'Pasta spaghetti, cepat saji dan lezat.', descriptionFull: 'Pasta spaghetti dari gandum durum pilihan, tekstur kenyal sempurna setelah dimasak. Cocok dipadukan dengan berbagai saus pasta kesukaan Anda.', price: 14000, stock: 95, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Pasta.png', status: 'stok tersedia' },
          { id: 'p15', name: 'Olive Oil', description: 'Minyak zaitun extra virgin, sehat untuk memasak.', descriptionFull: 'Minyak zaitun extra virgin dari perasan pertama buah zaitun, kaya antioksidan dan lemak tak jenuh tunggal. Ideal untuk salad dressing, menumis ringan, atau sebagai dipping sauce.', price: 60000, stock: 20, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Olive Oil.png', status: 'stok tersedia' },
          { id: 'p16', name: 'Mushrooms', description: 'Jamur kancing segar, penambah rasa umami.', descriptionFull: 'Jamur kancing segar pilihan, tekstur renyah dan rasa umami. Cocok untuk tumisan, sup, pizza, atau omelet. Sumber protein nabati yang baik.', price: 16000, stock: 55, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Mushrooms.png', status: 'stok tersedia' },
          { id: 'p17', name: 'Lemon', description: 'Lemon segar, sumber vitamin C dan aroma.', descriptionFull: 'Lemon segar impor, kulit cerah dan air melimpah. Sumber vitamin C alami dan memberikan aroma segar pada masakan atau minuman.', price: 7000, stock: 70, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Lemon.png', status: 'stok tersedia' },
          { id: 'p18', name: 'Honey', description: 'Madu murni alami, baik untuk kesehatan.', descriptionFull: 'Madu murni alami dari nektar bunga pilihan, tanpa tambahan pengawet. Rasa manis alami dan kaya akan manfaat kesehatan. Cocok untuk pemanis alami atau campuran minuman.', price: 40000, stock: 28, sellerId: 'user3', sellerName: 'pengguna_distributor', imageUrl: 'https://www.themealdb.com/images/ingredients/Honey.png', status: 'stok tersedia' },
          { id: 'p19', name: 'Spinach', description: 'Bayam segar, sayuran hijau bergizi.', descriptionFull: 'Bayam segar organik, daun hijau pekat dan renyah. Kaya zat besi dan vitamin. Sempurna untuk tumisan, sup, atau jus hijau.', price: 5000, stock: 110, sellerId: 'user1', sellerName: 'pengguna_utama', imageUrl: 'https://www.themealdb.com/images/ingredients/Spinach.png', status: 'stok tersedia' },
          { id: 'p20', name: 'Black Pepper', description: 'Lada hitam bubuk, bumbu penyedap masakan.', descriptionFull: 'Lada hitam bubuk murni, dengan aroma kuat dan rasa pedas yang khas. Ideal untuk membumbui daging, sayuran, atau saus. Menambah kehangatan pada setiap hidangan.', price: 10000, stock: 65, sellerId: 'user2', sellerName: 'pengguna_penjual_bumbu', imageUrl: 'https://www.themealdb.com/images/ingredients/Black Pepper.png', status: 'stok tersedia' },
        ];
        this.products = dummyProducts;
        this.saveProducts(); // Panggil saveProducts setelah setting dummy data
      }
    },
    
    // Aksi untuk menambah produk baru
    addProduct(newProduct: Omit<Product, 'id' | 'status'>) {
      const productId = `p${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const productStatus = newProduct.stock > 0 ? 'stok tersedia' : 'stok kosong';
      const productToAdd: Product = {
        ...newProduct,
        id: productId,
        status: productStatus,
        imageUrl: `https://www.themealdb.com/images/ingredients/${newProduct.name.replace(/ /g, '%20')}.png`
      };
      this.products.push(productToAdd);
      this.saveProducts();
      return productToAdd;
    },

    // Aksi untuk memperbarui produk
    updateProduct(updatedProduct: Product) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        updatedProduct.status = updatedProduct.stock > 0 ? 'stok tersedia' : 'stok kosong';
        this.products[index] = updatedProduct;
        this.saveProducts();
      }
    },

    // Aksi untuk menghapus produk
    deleteProduct(productId: string) {
      this.products = this.products.filter(product => product.id !== productId);
      this.saveProducts();
    },

    // Aksi untuk mengurangi stok setelah pembelian atau penambahan ke keranjang
    deductProductStock(productId: string, quantity: number): boolean {
      const product = this.products.find(p => p.id === productId);
      if (product && product.stock >= quantity) {
        product.stock -= quantity;
        product.status = product.stock > 0 ? 'stok tersedia' : 'stok kosong';
        this.saveProducts();
        return true;
      }
      return false;
    },

    // Aksi baru untuk menambahkan stok kembali
    addProductStock(productId: string, quantity: number) {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.stock += quantity;
        product.status = product.stock > 0 ? 'stok tersedia' : 'stok kosong';
        this.saveProducts();
      }
    }
  },
});
