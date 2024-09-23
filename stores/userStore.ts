import { defineStore } from 'pinia';

interface User {
  name: string;
  // Añade aquí los otros campos de tu usuario
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    setToken(token: string) {
      this.token = token;
      if (process.client) {
        localStorage.setItem('token', token);
      }
    },
    clearUser() {
      this.user = null;
      this.token = null;
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    restoreUser() {
      if (process.client) {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user) {
          this.user = JSON.parse(user) as User;
        }
        if (token) {
          this.token = token;
        }
      }
    },
  },
});
