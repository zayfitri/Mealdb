// src/stores/wallet.ts
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    balance: 1000000, // Saldo dummy awal: Rp 1.000.000
  }),
  getters: {
    getBalance(state): number {
      return state.balance;
    },
  },
  actions: {
    // Aksi untuk mengurangi saldo
    deductBalance(amount: number): boolean {
      if (this.balance >= amount) {
        this.balance -= amount;
        this.saveWallet(); // Simpan saldo ke localStorage
        return true; // Berhasil mengurangi saldo
      }
      return false; // Saldo tidak cukup
    },
    // Aksi untuk menambah saldo (untuk simulasi top-up manual admin)
    addBalance(amount: number) {
      this.balance += amount;
      this.saveWallet(); // Simpan saldo ke localStorage
    },
    // Aksi untuk memuat saldo dari localStorage
    loadWallet() {
      const savedBalance = localStorage.getItem('walletBalance');
      if (savedBalance !== null) {
        this.balance = parseFloat(savedBalance);
      }
    },
    // Aksi untuk menyimpan saldo ke localStorage
    saveWallet() {
      localStorage.setItem('walletBalance', this.balance.toString());
    },
  },
});
