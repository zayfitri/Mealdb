// src/stores/cart.ts
import { defineStore } from 'pinia';

// Definisikan tipe untuk item di keranjang
// Pastikan ada 'export' di sini!
export interface CartItem { 
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // Simpan stok maksimal produk
  imageUrl: string;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[], // Array untuk menyimpan item di keranjang
  }),
  getters: {
    // Getter untuk menghitung total jenis item di keranjang (produk unik)
    totalItems(state): number {
      return state.items.length; // Mengembalikan jumlah elemen di array, yaitu jumlah produk unik
    },
    // Getter untuk menghitung subtotal harga
    subtotal(state): number {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
  actions: {
    // Aksi untuk menambahkan produk ke keranjang
    addToCart(product: { id: string; name: string; price: number; stock: number; imageUrl: string }, quantity: number = 1) {
      const existingItem = this.items.find(item => item.productId === product.id);

      if (existingItem) {
        // Jika produk sudah ada di keranjang, perbarui kuantitas
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
          existingItem.quantity = newQuantity;
        } else {
          // Jika melebihi stok, set ke stok maksimal
          existingItem.quantity = product.stock;
          alert(`Maaf, stok ${product.name} hanya tersedia ${product.stock} unit. Kuantitas disesuaikan.`);
        }
      } else {
        // Jika produk belum ada di keranjang, tambahkan sebagai item baru
        if (quantity <= product.stock) {
          this.items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            stock: product.stock,
            imageUrl: product.imageUrl,
          });
        } else {
           alert(`Maaf, stok ${product.name} hanya tersedia ${product.stock} unit. Tidak dapat menambahkan kuantitas sebanyak itu.`);
        }
      }
      this.saveCart(); // Simpan keranjang ke localStorage
    },

    // Aksi untuk memperbarui kuantitas item di keranjang
    updateQuantity(productId: string, newQuantity: number) {
      const item = this.items.find(item => item.productId === productId);
      if (item) {
        if (newQuantity > 0 && newQuantity <= item.stock) {
          item.quantity = newQuantity;
        } else if (newQuantity <= 0) {
          this.removeFromCart(productId); // Hapus jika kuantitas <= 0
        } else {
          item.quantity = item.stock; // Set ke stok maksimal jika melebihi
          alert(`Maaf, stok ${item.name} hanya tersedia ${item.stock} unit. Kuantitas disesuaikan.`);
        }
      }
      this.saveCart(); // Simpan keranjang ke localStorage
    },

    // Aksi untuk menghapus item dari keranjang
    removeFromCart(productId: string) {
      this.items = this.items.filter(item => item.productId !== productId);
      this.saveCart(); // Simpan keranjang ke localStorage
    },

    // Aksi untuk membersihkan seluruh keranjang
    clearCart() {
      this.items = [];
      this.saveCart(); // Simpan keranjang ke localStorage
    },

    // Aksi untuk memuat keranjang dari localStorage saat aplikasi dimulai
    loadCart() {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },

    // Aksi untuk menyimpan keranjang ke localStorage
    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
  },
});
