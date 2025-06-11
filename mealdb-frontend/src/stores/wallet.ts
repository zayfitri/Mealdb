// src/stores/wallet.ts
import { defineStore } from 'pinia';
import { useUserStore } from './user'; // Import user store

export interface UserBalance {
    userId: string;
    balance: number;
}

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    // Kita akan menyimpan saldo untuk setiap pengguna dalam array
    allUserBalances: [] as UserBalance[],
  }),
  getters: {
    // Mendapatkan saldo pengguna yang sedang login
    getBalance(state): number {
      const userStore = useUserStore(); // Inisialisasi user store
      const currentUserId = userStore.getLoggedInUser?.id;
      if (currentUserId) {
        const userBalance = state.allUserBalances.find(ub => ub.userId === currentUserId);
        return userBalance ? userBalance.balance : 0;
      }
      return 0;
    },
    // Mendapatkan saldo untuk user ID tertentu
    getBalanceByUserId: (state) => (userId: string): number => {
        const userBalance = state.allUserBalances.find(ub => ub.userId === userId);
        return userBalance ? userBalance.balance : 0;
    }
  },
  actions: {
    // Aksi untuk mengurangi saldo pengguna yang sedang login (saat pembelian)
    deductBalance(amount: number): boolean {
      const userStore = useUserStore();
      const currentUserId = userStore.getLoggedInUser?.id;
      if (!currentUserId) return false;

      const userBalance = this.allUserBalances.find(ub => ub.userId === currentUserId);
      if (userBalance && userBalance.balance >= amount) {
        userBalance.balance -= amount;
        this.saveWallet();
        return true;
      }
      return false;
    },
    
    // Aksi untuk menambah saldo pengguna yang sedang login
    addBalance(amount: number) {
      const userStore = useUserStore();
      const currentUserId = userStore.getLoggedInUser?.id;
      if (!currentUserId) return;

      this.addBalanceToUser(currentUserId, amount); // Gunakan aksi umum
    },

    // Aksi umum untuk menambah saldo ke user ID tertentu (digunakan oleh admin atau transfer antar user)
    addBalanceToUser(userId: string, amount: number) {
        let userBalance = this.allUserBalances.find(ub => ub.userId === userId);
        if (userBalance) {
            userBalance.balance += amount;
        } else {
            // Jika user baru, inisialisasi saldo
            this.allUserBalances.push({ userId: userId, balance: amount });
        }
        this.saveWallet();
    },

    // Aksi umum untuk mengurangi saldo dari user ID tertentu (digunakan oleh admin)
    deductBalanceFromUser(userId: string, amount: number): boolean {
        let userBalance = this.allUserBalances.find(ub => ub.userId === userId);
        if (userBalance && userBalance.balance >= amount) {
            userBalance.balance -= amount;
            this.saveWallet();
            return true;
        }
        return false;
    },

    // Aksi untuk memuat semua saldo pengguna dari localStorage
    loadWallet() {
      const savedBalances = localStorage.getItem('allUserBalances');
      if (savedBalances !== null) {
        this.allUserBalances = JSON.parse(savedBalances);
      } else {
          // Inisialisasi saldo default untuk dummy users saat pertama kali
          const userStore = useUserStore();
          const initialBalances: UserBalance[] = userStore.getAllUsers.map(user => ({
              userId: user.id,
              balance: user.role === 'admin' ? 999999999 : 1000000 // Admin punya banyak saldo, user lain 1jt
          }));
          this.allUserBalances = initialBalances;
          this.saveWallet();
      }
    },

    // Aksi untuk menyimpan semua saldo pengguna ke localStorage
    saveWallet() {
      localStorage.setItem('allUserBalances', JSON.stringify(this.allUserBalances));
    },

    // Aksi untuk memastikan setiap user memiliki entri saldo saat dimuat
    initializeUserBalances() {
        const userStore = useUserStore();
        userStore.getAllUsers.forEach(user => {
            if (!this.allUserBalances.some(ub => ub.userId === user.id)) {
                this.allUserBalances.push({
                    userId: user.id,
                    balance: user.role === 'admin' ? 999999999 : 1000000 // Saldo default untuk user baru
                });
            }
        });
        this.saveWallet();
    }
  },
});
