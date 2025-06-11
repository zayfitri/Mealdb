// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { useCartStore } from './stores/cart';
import { useWalletStore } from './stores/wallet';
import { useOrderStore } from './stores/order';
import { useProductStore } from './stores/product';
import { useUserStore } from './stores/user'; // Import user store

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Muat semua store dari localStorage setelah Pinia terpasang
// Urutan penting: User > Wallet > Product > Cart > Order
const userStore = useUserStore();
userStore.loadUsers(); // Ini akan mengisi userStore.users

const walletStore = useWalletStore();
walletStore.loadWallet(); // Ini akan memuat semua saldo pengguna
walletStore.initializeUserBalances(); // Pastikan setiap user memiliki entri saldo (penting untuk user baru)

const productStore = useProductStore();
productStore.loadProducts(); // Produk mungkin merujuk ke user/sellerId, jadi userStore harus sudah dimuat

const cartStore = useCartStore();
cartStore.loadCart();

const orderStore = useOrderStore();
orderStore.loadOrders(); // Pesanan mungkin merujuk ke user/sellerId, jadi userStore dan productStore harus sudah dimuat

app.mount('#app');
