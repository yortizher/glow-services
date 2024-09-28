<script setup>
import { computed, onMounted } from 'vue';
import { useTheme } from "vuetify";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
const router = useRouter();



const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const userName = computed(() => user.value ? user.value.name : null);
const theme = useTheme();

const register = ref([
  {
    title: 'Registro Usuario',
    icon: 'mdi-home',
    to: '/Register',
  },
  {
    title: 'Registro Proveedor',
    icon: 'mdi-home',
    to: '/RegisterSupplier',
  }
]);

const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value == "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";
};

const goBack = () => {
  router.push({ path: "/" });
};
const logout = () => {
  userStore.clearUser();
  router.push('/'); // Redirigir a la página de inicio de sesión
};
onMounted(() => {
  userStore.restoreUser();
});
</script>

<template>
  <div class="toolbar-content">
    <v-toolbar height="90" class="bg-quinary toolbar pl-5 pr-5">
      <v-img src="logoHome.png" alt="Logo" max-height="100" max-width="130" contain class="logo-container"
        @click="goBack()"></v-img>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!userName" class="text-quaternary text-end options-header">
        <NuxtLink class="text-quaternary" to="/login">Inicie sesión</NuxtLink>
      </v-toolbar-items>
      <v-toolbar-items v-if="!userName"  class="text-quaternary text-end ml-5 options-header">
        <v-menu open-on-hover open-on-click>
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              Registrese
            </div>
          </template>
          <v-list class="text-center">
            <v-list-item v-for="(item, index) in register" :key="index">
              <v-list-item-title><NuxtLink :to="item.to" clas="text-primary items-list">{{ item.title }}</NuxtLink></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <v-toolbar-items v-if="userName" class="text-quaternary text-end options-header">
        <span>Hola, {{ userName }}!</span>
      </v-toolbar-items>
      <v-toolbar-items v-if="userName" class="text-quaternary text-end options-header">
        <v-icon @click="logout" class="text-quaternary ml-3" size="40" title="Cerrar sesión">mdi-logout</v-icon>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>
<style lang="scss">

.toolbar-content {
  position: fixed;
  z-index: 2;
  width: 100%;

  .icon-login {
    font-size: 2rem;
  }

  .logo-container {
    cursor: pointer;
  }
  .options-header {
    display: flex;
    align-items: center;
    font-family: 'Montserrat-Medium';
    font-size: 20px;
    line-height: normal;
    font-weight: bold;
    cursor: pointer;
    a {
      text-decoration: none;
    }
  }
  .items-list {
    text-decoration: none;
    color: #1237a9;
    font-family: 'Montserrat-Medium';
  }
}
</style>
