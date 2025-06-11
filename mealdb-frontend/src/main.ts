// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { useCartStore } from './stores/cart';
import { useWalletStore } from './stores/wallet';
import { useOrderStore } from './stores/order'; // Import order store

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Muat keranjang, saldo, dan pesanan dari localStorage setelah Pinia terpasang
const cartStore = useCartStore();
cartStore.loadCart();

const walletStore = useWalletStore();
walletStore.loadWallet();

const orderStore = useOrderStore(); // Inisialisasi order store
orderStore.loadOrders(); // Muat pesanan

app.mount('#app');
