<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDocs, collection, getFirestore, query, where } from "firebase/firestore";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/useCartStore"; // Importar el store del carrito

// Obtener la fecha actual en formato 'YYYY-MM-DD'
const today = new Date().toISOString().split("T")[0];
const userStore = useUserStore();
const router = useRouter();
const db = getFirestore();
const route = useRoute();
const services = ref([]);
const selectedService = ref(null);
const loading = ref(true);
const error = ref(null);
const citiesList = ref([]);
const selectedCity = ref(null);
const selectedDate = ref(null); // Fecha seleccionada
const matchedUsers = ref([]); // Usuarios que coinciden con la búsqueda
const showSnackbar = ref(false);
const textSnackbar = ref("");

// Acceso al store del carrito
const cartStore = useCartStore();

// Breadcrumbs items
const items = ref([
  { text: "Inicio", href: "/" },
  { text: "Servicios", href: "/Menu" },
  { text: "", href: "" }, // Aquí se llenará dinámicamente con el nombre del servicio
]);

// Función para obtener todos los servicios de la colección y buscar el seleccionado
const getAllServices = async () => {
  try {
    loading.value = true;
    error.value = null;

    const resServices = await getDocs(collection(db, "service_type"));
    services.value = resServices.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    filterSelectedService();
  } catch (err) {
    error.value = "Ocurrió un error al obtener los servicios.";
    console.error("Error al obtener los servicios:", err);
  } finally {
    loading.value = false;
  }
};

// Función para obtener y almacenar las ciudades
const fetchAndStoreCities = async () => {
  try {
    citiesList.value = [];
    const resCities = await getDocs(collection(db, "cities"));
    resCities.forEach((doc) => {
      citiesList.value.push(doc.data().name);
    });
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
  }
};

// Filtrar el servicio seleccionado según el slug
const filterSelectedService = () => {
  const slug = route.params.slug;
  selectedService.value = services.value.find(
    (service) => service.name === slug
  );

  if (!selectedService.value) {
    error.value = "El servicio no se encuentra disponible.";
  } else {
    items.value[2].text = selectedService.value.name;
    items.value[2].href = `/services/${selectedService.value.name}`;
  }
};

// Función para filtrar personal disponible
const handleBuscarPersonal = async () => {
  if (!userStore.user) {
    router.push("/login");
  } else {
    if (!selectedCity.value || !selectedDate.value) {
      showSnackbar.value = true;
      textSnackbar.value = "Por favor, selecciona una ciudad y una fecha.";
      return;
    }

    try {
      const serviceId = selectedService.value.id;
      const q = query(
        collection(db, "users"),
        where("id_roles", "==", "BrRcZz4BfmEKcUAhDQrs"), // El rol de proveedor de servicios
        where("services", "array-contains", serviceId),
        where("city", "==", selectedCity.value)
      );
      const querySnapshot = await getDocs(q);
      matchedUsers.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (matchedUsers.value.length === 0) {
        showSnackbar.value = true;
        textSnackbar.value = "No se encontró personal disponible.";
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  }
};

// Función para agregar el servicio al carrito (usando el store)
const addCart = () => {
  if (!selectedService.value || !selectedCity.value || !selectedDate.value) {
    showSnackbar.value = true;
    textSnackbar.value = "Selecciona un servicio, una ciudad y una fecha";
    return;
  }

  cartStore.agregarAlCarrito({
    serviceId: selectedService.value.id,
    serviceName: selectedService.value.name,
    city: selectedCity.value,
    date: selectedDate.value,
    price: selectedService.value.price,
  });

  showSnackbar.value = true;
  textSnackbar.value = "Servicio agregado al carrito";
};

// Llamar a las funciones al montar el componente
onMounted(() => {
  getAllServices();
  fetchAndStoreCities();
});

// Recalcular breadcrumbs cuando cambie la ruta o el servicio seleccionado
watch(route, filterSelectedService);
</script>

<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12" class="breadcrumbs">
      <v-breadcrumbs :items="items" color="primary">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :href="item.href">
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-col>
    <v-col cols="11" sm="7" md="7" lg="7" xl="7">
      <v-card class="mx-auto my-3" elevation="3">
        <v-row class="d-flex justify-center">
          <v-col
            class="d-flex align-center justify-center"
            cols="11"
            sm="11"
            md="6"
            lg="5"
            xl="5"
          >
            <v-img
              class="img-card"
              v-if="selectedService?.image"
              :src="selectedService.image"
              alt="Imagen del servicio"
            />
          </v-col>
          <v-col cols="11" sm="11" md="6" lg="5" xl="5">
            <h3
              class="text-primary text-center title-card mt-4"
              v-if="selectedService"
            >
              {{ selectedService.name }}
            </h3>
            <v-card-title v-else>{{
              loading ? "Cargando..." : "Servicio no disponible"
            }}</v-card-title>

            <v-card-text class="description-card" v-if="selectedService">
              Precio: ${{ selectedService.price }}
              <p class="text-center mb-2">Descripción</p>
              <p v-if="selectedService">{{ selectedService.description }}</p>
              <p v-else-if="error">{{ error }}</p>

              <!-- Selector de ciudad -->
              <v-col cols="12" class="pa-0 mt-3">
                <v-select
                  v-model="selectedCity"
                  label="Ciudad"
                  :items="citiesList"
                  variant="outlined"
                  color="primary"
                  required
                  clearable
                  clear-icon="mdi mdi-close-circle-outline"
                ></v-select>
              </v-col>

              <!-- Date picker debajo del selector de ciudad -->
              <v-col cols="12" class="pa-0 mt-3">
                <v-date-input
                  v-model="selectedDate"
                  prepend-icon=""
                  prepend-inner-icon="$calendar"
                  color="primary"
                  label="Selecciona una fecha"
                  :min="today"
                  variant="outlined"
                ></v-date-input>
              </v-col>
              <v-col class="pa-0">
                <v-btn
                  class="mt-2 btn-login bg-primary text-quinary"
                  elevation="0"
                  color="#fff"
                  block
                  @click="handleBuscarPersonal"
                >
                  Buscar personal
                </v-btn>
              </v-col>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <v-row
    v-if="matchedUsers.length > 0"
    class="mt-5 mb-5 resultados-busqueda"
    justify="center"
    dense
  >
    <v-col cols="12">
      <h3 class="text-center text-primary mb-4">Personal disponible</h3>
    </v-col>

    <!-- Aquí estamos iterando sobre los usuarios encontrados -->
    <v-col
      v-for="user in matchedUsers"
      :key="user.id"
      cols="11"
      sm="6"
      md="4"
      lg="3"
      class="staff-available"
    >
      <v-card elevation="3">
        <v-img
          v-if="user.profileImageUrl"
          :src="user.profileImageUrl"
          height="200px"
        ></v-img>
        <v-card-title class="text-center title">{{ user.name }}</v-card-title>
        <v-card-text>
          <p class="description">{{ user.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="bg-primary text-quinary"
            block
            @click="addCart"
          >
            Seleccionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar
    v-model="showSnackbar"
    timeout="3000"
    color="tertiary"
    location="top"
  >
    <div class="text-center">
      <span>{{ textSnackbar }}</span>
    </div>
  </v-snackbar>
</template>

<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}
.title-card {
  font-weight: bold;
  font-size: 25px;
}
.img-card {
  width: 100% !important;
  height: auto;
}
.description-card {
  font-size: 18px;
  line-height: 1.5;
  text-align: justify;
  margin-bottom: 20px;
  p:last-of-type {
    margin-bottom: 0;
  }
}
.staff-available {
  height: 100%;
  .title {
    font-weight: bold;
  }
  .description {
    font-size: 16px;
    text-align: justify;
  }
}
.breadcrumbs {
  position: sticky;
}
</style>
