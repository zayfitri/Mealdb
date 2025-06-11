// src/stores/order.ts
import { defineStore } from 'pinia';
// Ubah import CartItem menjadi type-only import
import type { CartItem } from './cart'; // Perhatikan tambahan 'type' di sini

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
}

// Definisikan tipe untuk sebuah pesanan
export interface Order {
  id: string;
  userId: string; // ID pengguna yang membuat pesanan
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string; // Tanggal pesanan dibuat
  deliveryDate?: string; // Tanggal pesanan sampai
  sellerId?: string; // ID penjual (nantinya akan ada)
  buyerReceivedConfirmed?: boolean; // Konfirmasi penerimaan oleh pembeli
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[], // Array untuk menyimpan semua pesanan
  }),
  getters: {
    // Getter untuk mendapatkan pesanan berdasarkan ID pengguna (nantinya)
    getOrdersByUserId: (state) => (userId: string) => {
      // Untuk simulasi, kita akan mengembalikan semua pesanan karena belum ada user ID
      // Ini akan disesuaikan saat ada user ID yang sebenarnya
      return state.orders.filter(order => order.userId === userId || true); // sementara selalu true agar semua order terlihat
    },
    // Getter untuk mendapatkan pesanan berdasarkan status
    getOrdersByStatus: (state) => (status: OrderStatus) => {
      return state.orders.filter(order => order.status === status);
    },
  },
  actions: {
    // Aksi untuk menambahkan pesanan baru setelah pembayaran berhasil
    addOrder(items: CartItem[], totalAmount: number, userId: string = 'dummy-user-id') {
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, // ID unik
        userId: userId,
        items: items.map(item => ({ // Salin data item keranjang
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: totalAmount,
        status: 'menunggu penjual', // Status awal setelah pembayaran
        orderDate: new Date().toISOString(),
      };
      this.orders.push(newOrder);
      this.saveOrders(); // Simpan pesanan ke localStorage
      return newOrder;
    },

    // Aksi untuk memperbarui status pesanan
    updateOrderStatus(orderId: string, newStatus: OrderStatus) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
        if (newStatus === 'sampai di tujuan') {
            order.deliveryDate = new Date().toISOString(); // Simpan tanggal sampai
        } else if (newStatus === 'diterima pembeli') {
            order.buyerReceivedConfirmed = true; // Konfirmasi penerimaan
        }
        this.saveOrders(); // Simpan perubahan
      }
    },

    // Aksi untuk memuat pesanan dari localStorage
    loadOrders() {
      const savedOrders = localStorage.getItem('userOrders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
    },

    // Aksi untuk menyimpan pesanan ke localStorage
    saveOrders() {
      localStorage.setItem('userOrders', JSON.stringify(this.orders));
    }
  },
});
