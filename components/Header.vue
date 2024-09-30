<script setup>
import { computed, onMounted } from 'vue';
import { useTheme } from "vuetify";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

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
    theme.global.name.value === "myCustomLightTheme"
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
    <v-toolbar height="90" class="toolbar bg-quinary pl-5 pr-5">
      <!-- Logo -->
      <v-img
        src="logoHome.png"
        alt="Logo"
        max-height="100"
        max-width="130"
        contain
        class="logo-container"
        @click="goBack"
      />
      
      <v-spacer />

      <!-- Opciones para usuario no autenticado -->
      <v-toolbar-items v-if="!userName" class="options-header text-quaternary text-end">
        <NuxtLink class="text-quaternary" to="/login">Inicie sesión</NuxtLink>
      </v-toolbar-items>

      <v-toolbar-items v-if="!userName" class="options-header text-quaternary text-end ml-5">
        <v-menu open-on-hover open-on-click>
          <template v-slot:activator="{ props }">
            <div v-bind="props">Registrese</div>
          </template>
          <v-list class="text-center">
            <v-list-item v-for="(item, index) in register" :key="index">
              <v-list-item-title>
                <NuxtLink :to="item.to" class="items-list text-quaternary">{{ item.title }}</NuxtLink>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <!-- Opciones para usuario autenticado -->
      <v-toolbar-items v-if="userName" class="options-header text-quaternary text-end">
        <NuxtLink to="/profile" > Hola, {{ userName.split(' ')[0] }}!</NuxtLink>
      </v-toolbar-items>
      <v-toolbar-items v-if="userName" class="options-header text-quaternary text-end">
        <v-icon
          @click="logout"
          class="text-quaternary ml-5 icon-logout "
          size="40"
          title="Cerrar sesión"
        >mdi-logout</v-icon>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<style lang="scss" scoped>
/* Contenedor principal del toolbar */
.toolbar-content {
  position: fixed;
  z-index: 2;
  width: 100%;
  cursor: pointer;
}

/* Estilos para la barra de herramientas */
.toolbar {
  padding-left: 20px;
  padding-right: 20px;
}

/* Estilos para el logo */
.logo-container {
  cursor: pointer;
}

/* Estilos generales para las opciones del toolbar */
.options-header {
  display: flex;
  align-items: center;
  font-family: 'Montserrat-Medium';
  font-size: 20px;
  line-height: normal;
  font-weight: bold;

  a {
    cursor: pointer;
    text-decoration: none;
    color: #1237a9;
  }
}

/* Estilos específicos para la lista de opciones */
.items-list {
  cursor: pointer;
  text-decoration: none;
  color: #1237a9;
  font-family: 'Montserrat-Medium';
}
</style>
