// middleware/admin.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from "pinia";



export default defineNuxtRouteMiddleware((to, from) => {
  const adminRoleId = 'bQf1glwn1acUXQD1ZWzJ' // Reemplaza con tu ID real
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const isAdmin = computed(() => {
    return user.value && user.value.id_roles === adminRoleId;
  });

  // Verificar si el usuario tiene el rol de administrador
  if (!isAdmin.value) {
    return navigateTo('/') // Redirige si el usuario no es administrador
  }
})
