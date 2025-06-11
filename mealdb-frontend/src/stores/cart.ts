// src/stores/cart.ts
import { defineStore } from 'pinia';
import { useProductStore } from './product'; // Pastikan ini adalah satu-satunya import lain selain Pinia

// TIDAK BOLEH ADA: import { CartItem } from './cart'; di sini

// Definisikan tipe untuk item di keranjang
// Pastikan ada 'export' di sini!
export interface CartItem { 
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // Simpan stok maksimal produk (ini adalah stok awal produk saat ditambahkan ke keranjang)
  imageUrl: string;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems(state): number {
      return state.items.length;
    },
    subtotal(state): number {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
  actions: {
    addToCart(product: { id: string; name: string; price: number; stock: number; imageUrl: string }, quantity: number = 1) {
      const productStore = useProductStore();

      const existingItem = this.items.find(item => item.productId === product.id);

      const currentProductInStore = productStore.getProductById(product.id);
      if (!currentProductInStore || currentProductInStore.stock < quantity) {
        alert(`Maaf, stok ${product.name} tidak cukup. Tersedia: ${currentProductInStore ? currentProductInStore.stock : 0} unit.`);
        return;
      }

      if (existingItem) {
        if (productStore.deductProductStock(product.id, quantity)) {
          existingItem.quantity += quantity;
          alert(`"${product.name}" kuantitasnya berhasil diperbarui di keranjang.`);
        } else {
           alert(`Maaf, stok ${product.name} tidak cukup untuk menambahkan ${quantity} unit lagi.`);
        }
      } else {
        if (productStore.deductProductStock(product.id, quantity)) {
          this.items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            stock: product.stock,
            imageUrl: product.imageUrl,
          });
          alert(`"${product.name}" berhasil ditambahkan ke keranjang.`);
        } else {
          alert(`Maaf, stok ${product.name} tidak cukup.`);
        }
      }
      this.saveCart();
    },

    updateQuantity(productId: string, newQuantity: number) {
      const productStore = useProductStore();
      const item = this.items.find(item => item.productId === productId);
      
      if (item) {
        const oldQuantity = item.quantity;
        const quantityDifference = newQuantity - oldQuantity;
        
        if (quantityDifference > 0) {
          const currentProductInStore = productStore.getProductById(productId);
          if (!currentProductInStore || currentProductInStore.stock < quantityDifference) {
            alert(`Maaf, stok ${item.name} tidak cukup untuk menambahkan ${quantityDifference} unit lagi. Tersedia: ${currentProductInStore ? currentProductInStore.stock : 0}.`);
            return;
          }
          if (productStore.deductProductStock(productId, quantityDifference)) {
            item.quantity = newQuantity;
          }
        } else if (quantityDifference < 0) {
          productStore.addProductStock(productId, Math.abs(quantityDifference));
          item.quantity = newQuantity;
        } else if (newQuantity === 0) {
          this.removeFromCart(productId);
        }
      }
      this.saveCart();
    },

    removeFromCart(productId: string) {
      const productStore = useProductStore();
      const itemToRemove = this.items.find(item => item.productId === productId);

      if (itemToRemove) {
        productStore.addProductStock(productId, itemToRemove.quantity);
      }
      this.items = this.items.filter(item => item.productId !== productId);
      this.saveCart();
    },

    clearCart() {
      const productStore = useProductStore();
      this.items.forEach(item => {
        productStore.addProductStock(item.productId, item.quantity);
      });
      this.items = [];
      this.saveCart();
    },

    clearCartOnCheckout() {
      this.items = [];
      this.saveCart();
    },

    loadCart() {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },

    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
  },
});
