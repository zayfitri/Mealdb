// src/stores/order.ts
import { defineStore } from 'pinia';
import type { CartItem } from './cart';
import { useProductStore } from './product'; // Pastikan diimpor
import { useUserStore } from './user'; // Pastikan diimpor
import { useWalletStore } from './wallet'; // Pastikan diimpor

// Definisikan tipe untuk status pesanan
export type OrderStatus =
  | 'stok kosong'
  | 'stok tersedia'
  | 'menunggu penjual'
  | 'diproses penjual'
  | 'menunggu kurir'
  | 'sedang dikirim'
  | 'sampai di tujuan'
  | 'diterima pembeli'
  | 'dikomplain'
  | 'dikirim balik'
  | 'transaksi gagal';

// Definisikan tipe untuk item pesanan (snapshot dari item keranjang saat checkout)
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  sellerId: string; // Tambahkan sellerId ke OrderItem untuk identifikasi penjual
  sellerName: string; // Tambahkan sellerName
}

// Definisikan tipe untuk sebuah pesanan
export interface Order {
  id: string;
  userId: string; // ID pengguna yang membuat pesanan (pembeli)
  items: OrderItem[];
  totalAmount: number; // Total harga pesanan (dari pembeli)
  status: OrderStatus;
  orderDate: string; // Tanggal pesanan dibuat
  deliveryDate?: string; // Tanggal pesanan sampai
  buyerReceivedConfirmed?: boolean; // Konfirmasi penerimaan oleh pembeli
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[], // Array untuk menyimpan semua pesanan
  }),
  getters: {
    getOrdersByUserId: (state) => (userId: string) => {
      return state.orders.filter(order => order.userId === userId);
    },
    // Getter untuk mendapatkan pesanan untuk penjual tertentu
    getOrdersForSeller: (state) => (sellerId: string) => {
        // Filter pesanan di mana setidaknya satu item di pesanan tersebut dijual oleh sellerId ini
        return state.orders.filter(order =>
            order.items.some(item => item.sellerId === sellerId)
        );
    },
    // Getter untuk mendapatkan pesanan berdasarkan status
    getOrdersByStatus: (state) => (status: OrderStatus) => {
      return state.orders.filter(order => order.status === status);
    },
  },
  actions: {
    addOrder(items: CartItem[], totalAmount: number, userId: string) {
      const productStore = useProductStore(); // Inisialisasi product store

      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: userId,
        items: items.map(item => {
          const product = productStore.getProductById(item.productId);
          return { // Salin data item keranjang + informasi penjual
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            sellerId: product?.sellerId || 'unknown_seller', // Ambil sellerId dari productStore
            sellerName: product?.sellerName || 'Unknown Seller', // Ambil sellerName dari productStore
          };
        }),
        totalAmount: totalAmount,
        status: 'menunggu penjual',
        orderDate: new Date().toISOString(),
      };
      this.orders.push(newOrder);
      this.saveOrders();
      return newOrder;
    },

    updateOrderStatus(orderId: string, newStatus: OrderStatus) {
      const order = this.orders.find(o => o.id === orderId);
      const walletStore = useWalletStore(); // Inisialisasi wallet store di sini

      if (order) {
        order.status = newStatus;
        if (newStatus === 'sampai di tujuan') {
            order.deliveryDate = new Date().toISOString();
        } else if (newStatus === 'diterima pembeli') {
            order.buyerReceivedConfirmed = true;
            // Ketika pembeli mengkonfirmasi penerimaan, tambahkan uang ke saldo penjual
            // Iterasi setiap item dalam pesanan untuk menemukan penjual yang relevan dan tambahkan saldo
            // Pastikan setiap penjual mendapatkan bagiannya, hanya sekali per item per order.
            const uniqueSellerIds = new Set(order.items.map(item => item.sellerId));
            uniqueSellerIds.forEach(sellerId => {
                const revenueForThisSeller = order.items
                    .filter(item => item.sellerId === sellerId)
                    .reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                if (revenueForThisSeller > 0) {
                    console.log(`Menambahkan Rp${revenueForThisSeller} ke saldo penjual dengan ID: ${sellerId}`);
                    walletStore.addBalanceToUser(sellerId, revenueForThisSeller); // Panggil aksi baru di walletStore
                }
            });
        }
        this.saveOrders();
      }
    },

    loadOrders() {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
    },

    saveOrders() {
      localStorage.setItem('userOrders', JSON.stringify(this.orders));
    }
  },
});
