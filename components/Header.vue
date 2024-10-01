<script setup>
/* --------------------- Importaciones --------------------- */
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";

/* --------------------- Inicialización --------------------- */
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const drawer = ref(false);

/* --------------------- Variables Computadas --------------------- */
const userName = computed(() => (user.value ? user.value.name : null));

/* --------------------- Datos --------------------- */
const register = ref([
  { title: "Registro Usuario", icon: "mdi-home", to: "/Register" },
  { title: "Registro Proveedor", icon: "mdi-home", to: "/RegisterSupplier" },
]);

/* --------------------- Temas --------------------- */
const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";
};

/* --------------------- Métodos --------------------- */
const goBack = () => {
  router.push({ path: "/" });
};

const logout = () => {
  userStore.clearUser();
  router.push("/"); // Redirigir a la página de inicio de sesión
};

/* --------------------- Ciclo de Vida --------------------- */
onMounted(() => {
  userStore.restoreUser();
});
</script>

<template>
  <!-- Toolbar -->
  <div class="toolbar">
    <v-toolbar height="90" class="toolbar__container bg-quinary pl-5">
      <!-- Logo y redirección al inicio -->
      <v-img
        src="logoHome.png"
        alt="Logo"
        max-height="100"
        max-width="130"
        contain
        class="toolbar__logo"
        @click="goBack"
      />

      <v-spacer />

      <!-- Opciones del Toolbar -->
      <v-toolbar-items class="toolbar__items d-none d-sm-flex pr-5">
        <!-- Link a Servicios -->
        <v-toolbar-items class="toolbar__item toolbar__item--services text-end mr-5">
          <NuxtLink class="toolbar__link" to="/Services">Servicios</NuxtLink>
        </v-toolbar-items>

        <!-- Iniciar sesión (cuando no hay usuario) -->
        <v-toolbar-items
          v-if="!userName"
          class="toolbar__item toolbar__item--login text-end"
        >
          <NuxtLink class="toolbar__link" to="/login">Inicie sesión</NuxtLink>
        </v-toolbar-items>

        <!-- Registro (cuando no hay usuario) -->
        <v-toolbar-items
          v-if="!userName"
          class="toolbar__item toolbar__item--register text-end ml-5"
        >
          <v-menu open-on-hover open-on-click>
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="toolbar__link">Regístrese</div>
            </template>
            <v-list class="toolbar__list">
              <v-list-item
                v-for="(item, index) in register"
                :key="index"
                class="toolbar__list-item"
              >
                <v-list-item-title>
                  <NuxtLink
                    :to="item.to"
                    class="toolbar__list-link"
                  >{{ item.title }}</NuxtLink>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>

        <!-- Perfil del usuario (cuando hay usuario) -->
        <v-toolbar-items
          v-if="userName"
          class="toolbar__item toolbar__item--profile text-end"
        >
          <NuxtLink class="toolbar__link" to="/Profile">
            Hola, {{ userName.split(" ")[0] }}!
          </NuxtLink>
        </v-toolbar-items>

        <!-- Cerrar sesión (cuando hay usuario) -->
        <v-toolbar-items
          v-if="userName"
          class="toolbar__item toolbar__item--logout text-end"
        >
          <v-icon
            @click="logout"
            class="toolbar__icon toolbar__icon--logout ml-5"
            size="40"
            title="Cerrar sesión"
          >
            mdi-logout
          </v-icon>
        </v-toolbar-items>
      </v-toolbar-items>

      <!-- Menú lateral (versión móvil) -->
      <v-toolbar-items class="toolbar__menu-button d-flex align-center mr-2">
        <v-icon
          @click.stop="drawer = !drawer"
          class="toolbar__icon toolbar__icon--menu ml-5 d-flex d-sm-none"
          size="40"
          title="Menú"
        >
          mdi-menu
        </v-icon>
      </v-toolbar-items>
    </v-toolbar>
  </div>

  <!-- Drawer de navegación (versión móvil) -->
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    class="toolbar__drawer d-flex d-sm-none"
  >
    <v-list v-if="!userName">
      <v-list-item>
        <v-list-item-content class="text-center">
          <v-list-item-title>
            <NuxtLink class="toolbar__drawer-link" to="/login"
              >Inicie sesión</NuxtLink
            >
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content class="text-center">
          <v-list-item-title>
            <NuxtLink class="toolbar__drawer-link" to="/Register"
              >Registro Usuario</NuxtLink
            >
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content class="text-center">
          <v-list-item-title>
            <NuxtLink class="toolbar__drawer-link" to="/RegisterSupplier"
              >Registro Proveedor</NuxtLink
            >
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-if="userName">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <NuxtLink class="toolbar__drawer-link" to="/Profile">
              Hola, {{ userName.split(" ")[0] }}!
            </NuxtLink>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-content>
          <v-list-item-title class="toolbar__drawer-link"
            >Cerrar sesión</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
/* --------------------- Bloques Principales --------------------- */

/* Contenedor principal del toolbar */
.toolbar {
  &__container {
    position: fixed;
    z-index: 2;
    width: 100%;
  }

  &__logo {
    cursor: pointer;
  }

  /* Estilos generales para las opciones del toolbar */
  &__items {
    display: flex;
    align-items: center;
  }

  /* Estilos para cada item del toolbar */
  &__item {
    display: flex;
    align-items: center;
    font-family: "Montserrat-Medium";
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;

    &--services,&--login {
      .toolbar__link {
        border-right: solid 2px #1237a9;
        padding-right: 15px;
      }
    }

    &--register,
    &--profile,
    &--logout {
      /* Modificadores específicos pueden tener estilos adicionales si es necesario */
    }
  }

  &__link {
    text-decoration: none;
    color: #1237a9;
  }

  /* Estilos específicos para la lista de opciones */
  &__list {
    text-align: center;
    background: transparent;
  }

  &__list-item {
    margin: 0;
  }

  &__list-link {
    text-decoration: none;
    color: #1237a9;
    font-family: "Montserrat-Medium";
  }

  /* Estilos para íconos */
  &__icon {
    cursor: pointer;

    &--logout,
    &--menu {
      color: #1237a9;
    }
  }

  /* Botón del menú lateral (versión móvil) */
  &__menu-button {
    display: flex;
    align-items: center;
  }

  /* Drawer de navegación para versión móvil */
  &__drawer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__drawer-link {
    text-decoration: none;
    color: #1237a9;
    font-family: "Montserrat-Medium";
  }
}
</style>
