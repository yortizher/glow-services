<script setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/useCartStore"; // Importar el store del carrito

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const drawer = ref(false); // Drawer para menú de navegación móvil
const drawerCart = ref(false); // Drawer para mostrar el carrito de compras

const userName = computed(() => (user.value ? user.value.name : null));
const profileImageUrl = computed(() =>
  user.value ? user.value.profileImageUrl : null
);

const adminRoleId = "bQf1glwn1acUXQD1ZWzJ"; // ID del rol de administrador
const isAdmin = computed(
  () => user.value && user.value.id_roles === adminRoleId
);

const register = ref([
  { title: "Registro Usuario", icon: "mdi-home", to: "/Register" },
  { title: "Registro Proveedor", icon: "mdi-home", to: "/RegisterSupplier" },
]);

const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";
};

// Acceder al store del carrito
const cartStore = useCartStore();
const { totalItems, items } = storeToRefs(cartStore); // Total de artículos en el carrito y los ítems

const abrirCarrito = () => {
  drawerCart.value = true;
};

const goBack = () => {
  router.push({ path: "/" });
};

const logout = () => {
  userStore.clearUser();
  router.push("/"); // Redirigir a la página de inicio de sesión
};

onMounted(() => {
  userStore.restoreUser();
  cartStore.loadCart(); // Cargar el carrito desde localStorage
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
      <v-toolbar-items class="toolbar__items d-none d-md-flex pr-5">
        <!-- Link a Servicios -->
        <v-toolbar-items
          class="toolbar__item toolbar__item--services text-end mr-5"
        >
          <NuxtLink class="toolbar__link" to="/Menu">Servicios</NuxtLink>
        </v-toolbar-items>

        <v-toolbar-items
          v-if="isAdmin"
          class="toolbar__item toolbar__item--administration text-end mr-5"
        >
          <NuxtLink class="toolbar__link" to="/Administration"
            >Administración</NuxtLink
          >
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
                  <NuxtLink :to="item.to" class="toolbar__list-link">{{
                    item.title
                  }}</NuxtLink>
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

        <!-- Ícono del carrito con contador -->
        <v-toolbar-items
          class="toolbar__item toolbar__item--cart text-end ml-5"
        >
          <v-badge :content="totalItems" color="primary" text-color="quinary">
            <v-icon
              size="40"
              color="quaternary"
              @click="abrirCarrito"
              title="Ver carrito"
              class="toolbar__icon toolbar__icon--cart"
              >mdi-cart</v-icon
            >
          </v-badge>
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
          class="toolbar__icon toolbar__icon--menu ml-5 d-flex d-md-none"
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
    location="left"
    class="toolbar__drawer toolbar__drawer--mobile d-flex d-md-none"
  >
    <v-list v-if="!userName" class="toolbar__drawer-list">
      <v-col class="toolbar__drawer-avatar d-flex justify-center mb-2">
        <v-avatar size="100" variant="outlined" color="primary">
          <v-icon size="70" title="Menú">mdi-account</v-icon>
        </v-avatar>
      </v-col>
      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink class="toolbar__drawer-link text-quinary" to="/login"
            >Inicie sesión</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink class="toolbar__drawer-link text-quinary" to="/Register"
            >Registro Usuario</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink
            class="toolbar__drawer-link text-quinary"
            to="/RegisterSupplier"
            >Registro Proveedor</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink class="toolbar__drawer-link text-quinary" to="/Menu"
            >Servicios</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list v-if="userName" class="toolbar__drawer-list">
      <v-col
        v-if="profileImageUrl"
        class="toolbar__drawer-avatar d-flex justify-center mb-2"
      >
        <v-avatar
          :image="profileImageUrl"
          size="100"
          variant="outlined"
          color="primary"
        ></v-avatar>
      </v-col>
      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink class="toolbar__drawer-link text-quinary" to="/Profile">
            Hola, {{ userName.split(" ")[0] }}!
          </NuxtLink>
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="isAdmin"
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink
            class="toolbar__drawer-link text-quinary"
            to="/Administration"
            >Administración</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title>
          <NuxtLink class="toolbar__drawer-link text-quinary" to="/Menu"
            >Servicios</NuxtLink
          >
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="logout"
        class="toolbar__drawer-list-item text-center bg-primary mb-1"
      >
        <v-list-item-title class="toolbar__drawer-link text-quinary"
          >Cerrar sesión</v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Drawer de resumen del carrito -->
  <v-navigation-drawer
    width="400"
    mode="temporary"
    :mobile-breakpoint="9999"
    v-model="drawerCart"
    location="right"
    class="toolbar__drawer toolbar__drawer--cart"
  >
    <header class="toolbar__cart-header bg-primary text-quinary">
      <h2 class="toolbar__cart-title">Carrito de Compras</h2>
      <!-- Botón de cerrar -->
      <v-btn
       variant="text"
        icon
        class="toolbar__cart-close-btn"
        @click="drawerCart = false"
        aria-label="Cerrar carrito"
        title="Cerrar carrito"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </header>

    <!-- Mostrar los productos del carrito -->
    <section v-if="items.length > 0" class="toolbar__cart-content">
      <v-list class="toolbar__cart-list">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="toolbar__cart-list-item"
        >
          <v-list-item-title class="toolbar__cart-item-title"
            >{{ item.serviceName }} - {{ item.city }}</v-list-item-title
          >
          <v-list-item-subtitle class="toolbar__cart-item-subtitle"
            >Fecha: {{ item.date }}</v-list-item-subtitle
          >
          <v-list-item-action
            class="toolbar__cart-item-action d-flex justify-end"
          >
            <v-btn
              variant="text"
              color="red"
              icon
              @click="cartStore.eliminarDelCarrito(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <!-- Precio total -->
      <v-list-item class="toolbar__cart-total">
        <v-list-item-title
          >Total: ${{ cartStore.totalPrice }}</v-list-item-title
        >
      </v-list-item>

      <!-- Botón para proceder al pago -->
      <v-btn block color="primary" class="toolbar__cart-pay-button text-quinary"
        >Pagar</v-btn
      >
    </section>
    <section v-else class="toolbar__cart-empty">
      <h3 class="toolbar__cart-empty-text">Carrito vacío</h3>
    </section>
  </v-navigation-drawer>
  <div class="button-fixed bg-quinary d-flex d-md-none">
    <v-badge :content="totalItems" color="primary" text-color="quinary">
      <v-icon
        size="40"
        color="quaternary"
        @click="abrirCarrito"
        title="Ver carrito"
        >mdi-cart</v-icon
      >
    </v-badge>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  &__container {
    position: fixed;
    z-index: 2;
    width: 100%;
  }

  &__logo {
    cursor: pointer;
  }

  &__items {
    display: flex;
    align-items: center;
  }

  &__item {
    display: flex;
    align-items: center;
    font-family: "Montserrat-Medium";
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;

    &--services,
    &--login,
    &--administration,
    &--register,
    &--profile,
    &--logout,
    &--cart {
      margin-right: 15px;
    }

    &--services,
    &--login {
      .toolbar__link {
        border-right: solid 2px #1237a9;
        padding-right: 15px;
      }
    }
  }

  &__link {
    text-decoration: none;
    color: #1237a9;
  }

  &__list {
    text-align: center;
    background: transparent;
  }

  &__list-item {
    margin: 0;
  }

  &__list-link {
    text-decoration: none;
    font-family: "Montserrat-Medium";
  }

  &__icon {
    cursor: pointer;

    &--logout,
    &--menu,
    &--cart {
      color: #1237a9;
    }
  }

  &__menu-button {
    display: flex;
    align-items: center;
  }

  &__drawer {
    &--mobile,
    &--cart {
      display: flex;
      flex-direction: column;
    }
  }

  &__drawer-link {
    text-decoration: none;
    color: #1237a9;
    font-family: "Montserrat-Medium";
  }

  /* Estilos para el drawer del carrito */
  &__cart-header {
    position: relative;
    padding: 16px;
  }

  &__cart-title {
    text-align: center;
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  &__cart-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    .v-icon {
      font-size: 24px;
    }
  }

  &__cart-content {
    padding: 16px;
  }

  &__cart-list {
    padding: 0;
  }

  &__cart-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__cart-item-title,
  &__cart-item-subtitle {
    margin: 0;
  }

  &__cart-item-action {
    margin-left: auto;
  }

  &__cart-total {
    font-weight: bold;
    margin-top: 16px;
  }

  &__cart-pay-button {
    margin-top: 16px;
  }

  &__cart-empty {
    padding: 16px;
    text-align: center;
  }

  &__cart-empty-text {
    font-size: 18px;
    color: #666;
  }

  /* Estilos para el drawer móvil */
  &__drawer-list {
    padding: 0;
  }

  &__drawer-list-item {
    margin: 0;
  }

  &__drawer-avatar {
    margin-bottom: 16px;
  }
}
.button-fixed {
  border-radius: 50%;
  border: 1px solid #1ed5b9;
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 10px;
  right: 15px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
