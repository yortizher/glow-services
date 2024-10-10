import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUserStore } from '@/stores/userStore';

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();

  if (!userStore.user) {
    return navigateTo('/login');
  }
});
