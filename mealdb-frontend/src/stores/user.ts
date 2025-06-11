// src/stores/user.ts
import { defineStore } from 'pinia';

export type UserRole = 'user' | 'courier' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    users: [] as User[],
  }),
  getters: {
    getLoggedInUser(state): User | null {
      return state.currentUser;
    },
    isLoggedIn(state): boolean {
      return state.currentUser !== null;
    },
    hasRole: (state) => (role: UserRole): boolean => {
      return state.currentUser?.role === role;
    },
    getAllUsers(state): User[] {
      return state.users;
    },
    getUserById: (state) => (userId: string): User | undefined => {
        return state.users.find(user => user.id === userId);
    }
  },
  actions: {
    loadUsers() {
      console.log('User Store: Loading users...');
      const savedUsers = localStorage.getItem('allUsers');
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
        console.log('User Store: Users loaded from localStorage:', this.users);
      } else {
        // --- INI ADALAH DATA DUMMY YANG DIGUNAKAN ---
        const dummyUsers: User[] = [
          { id: 'user1', username: 'pengguna_utama', email: 'user1@example.com', role: 'user' },
          { id: 'user2', username: 'pengguna_penjual_bumbu', email: 'user2@example.com', role: 'user' },
          { id: 'user3', username: 'pengguna_distributor', email: 'user3@example.com', role: 'user' },
          { id: 'courier1', username: 'kurir_cepat', email: 'courier1@example.com', role: 'courier' },
          { id: 'admin1', username: 'admin_utama', email: 'admin1@example.com', role: 'admin' },
        ];
        this.users = dummyUsers;
        localStorage.setItem('allUsers', JSON.stringify(dummyUsers));
        console.log('User Store: Initial dummy users set:', this.users);
      }

      const savedCurrentUser = localStorage.getItem('currentUser');
      if (savedCurrentUser) {
          this.currentUser = JSON.parse(savedCurrentUser);
          console.log('User Store: Current user loaded from localStorage:', this.currentUser);
      } else {
          // Hanya set default user jika belum ada currentUser
          if (!this.currentUser) { 
            this.currentUser = this.users.find(u => u.id === 'user1') || null; 
            this.saveCurrentUser();
            console.log('User Store: Default current user set:', this.currentUser);
          }
      }
      console.log('User Store: Finished loading users.');
    },
    saveUsers() {
      localStorage.setItem('allUsers', JSON.stringify(this.users));
      console.log('User Store: Users saved to localStorage.');
    },
    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        console.log('User Store: Current user saved to localStorage.');
    },

    login(username: string, role: UserRole) {
      console.log('User Store: Received login attempt for:', { username, role });
      console.log('User Store: Available users (internal state):', this.users);
      const user = this.users.find(u => u.username === username && u.role === role);
      if (user) {
        this.currentUser = user;
        this.saveCurrentUser();
        console.log('User Store: Login successful for:', user);
        alert(`Selamat datang, ${user.username}! Anda login sebagai ${user.role}.`);
        return true;
      }
      console.log('User Store: Login failed. No matching user found.');
      alert('Login gagal. Nama pengguna atau peran tidak valid.');
      return false;
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      console.log('User Store: User logged out.');
      alert('Anda telah logout.');
    },

    addUser(newUser: Omit<User, 'id'>) {
        const newId = `${newUser.role}${this.users.length + 1}`;
        const userToAdd: User = { ...newUser, id: newId };
        this.users.push(userToAdd);
        this.saveUsers();
        return userToAdd;
    },
    updateUser(updatedUser: User) {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            this.users[index] = updatedUser;
            this.saveUsers();
        }
    },
    deleteUser(userId: string) {
        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();
    },
  },
});
