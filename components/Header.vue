<script setup>
import { computed, onMounted } from 'vue';
import { useTheme } from "vuetify";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
const router = useRouter();



const userStore = useUserStore();
const { user } = storeToRefs(userStore);

console.log(user);


const userName = computed(() => user.value ? user.value.name : null);
console.log(userName);
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
onMounted(() => {
  userStore.restoreUser();
});
</script>

<template>
  <div class="toolbar-content">
    <v-toolbar height="90" class="bg-quinary toolbar pl-5 pr-5">
      <v-img src="logoHome.png" alt="Logo" max-height="100" max-width="130" contain class="logo-container"
        @click="goBack()"></v-img>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-spacer></v-spacer>
      <!-- <v-toolbar-title class="text-quaternary" style="font-family: 'MiFuente';font-size: 40px;line-height: normal;">Glow Services</v-toolbar-title> -->
      <!-- <v-btn icon @click="toggleTheme">
        <v-icon class="text-quaternary icon-login" title="Inicia sesión">mdi-account</v-icon>
      </v-btn> -->
      <!-- <v-toolbar-item class="text-quaternary text-end mr-2" style="font-family: 'MiFuente';font-size: 20px;line-height: normal;font-weight: bold;">Glow Services</v-toolbar-item> -->
      <v-toolbar-items class="text-quaternary text-end options-header">
        <NuxtLink class="text-quaternary" to="/login">Inicie sesión</NuxtLink>
      </v-toolbar-items>
      <v-toolbar-items  class="text-quaternary text-end ml-5 options-header">
        <v-menu open-on-hover open-on-click>
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              Registrese
            </div>
          </template>
          
          <v-list class="text-center">
            <v-list-item v-for="(item, index) in register" :key="index">
              <v-list-item-title><NuxtLink style="text-decoration: none;color: #1237a9;font-family: 'Montserrat-Medium';"  :to="item.to" clas="text-primary">{{ item.title }}</NuxtLink></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-toolbar-items v-if="userName" class="text-quaternary text-end options-header">
      <span>Hola, {{ userName }}!</span>
    </v-toolbar-items>
    <!-- <v-toolbar-items v-if="user && user.name" class="text-quaternary text-end options-header">
      <span>Hola, {{ user.name }}!</span>
    </v-toolbar-items> -->
  </div>
</template>
<style lang="scss">
.toolbar-content {
  position: fixed;
  z-index: 2;
  width: 100%;

  .icon-login {
    font-size: 3rem;
  }

  .logo-container {
    cursor: pointer;
  }
  .options-header {
    font-family: 'Montserrat-Medium';
    font-size: 20px;
    line-height: normal;
    font-weight: bold;
    cursor: pointer;
    a {
      text-decoration: none;
    }
  }
}
</style>
