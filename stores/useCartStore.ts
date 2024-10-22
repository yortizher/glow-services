import { defineStore } from 'pinia';

// Definir las interfaces o tipos
interface Service {
  serviceId: string;
  serviceName: string;
  city: string;
  date: string;
  price: number;
}

interface CartState {
  items: Service[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state): number => state.items.length,
    totalPrice: (state): number =>
      state.items.reduce((total, item) => total + Number(item.price), 0),
  },

  actions: {
    agregarAlCarrito(servicio: Service) {
      this.items.push(servicio);
      this.saveCart(); // Guardar el carrito en localStorage
    },
    eliminarDelCarrito(index: number) {
      this.items.splice(index, 1);
      this.saveCart(); // Guardar el carrito en localStorage
    },
    limpiarCarrito() {
      this.items = [];
      this.saveCart(); // Guardar el carrito en localStorage
    },
    saveCart() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
      }
    },
    loadCart() {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          this.items = JSON.parse(storedItems) as Service[];
          // Convertir el price de cada item a número
          this.items.forEach(item => {
            item.price = Number(item.price);
          });
        }
      }
    }
  },
});
