<template>
  <v-row class="d-flex justify-center">
    <v-col cols="11" sm="7" md="7" lg="7" xl="7">
      <v-card class="mx-auto my-8" elevation="3">
        <v-row class="d-flex justify-center">
          <v-col cols="11" sm="11" md="6" lg="5" xl="5">
            <v-img
              class="img-card"
              v-if="selectedService?.image"
              :src="selectedService.image"
              alt="Imagen del servicio"
            />
          </v-col>
          <v-col cols="11" sm="11" md="6" lg="5" xl="5">
            <h3
              class="text-primary text-center title-card"
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

              <!-- Time picker debajo del selector de ciudad -->
              <v-col cols="12" class="pa-0 mt-3">
                <v-date-input
                  v-model="selectedDate"
                  label="Selecciona una fecha"
                  :min="today"
                  max-width="368"
                ></v-date-input>
              </v-col>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDocs, collection, getFirestore } from "firebase/firestore";

// Obtener la fecha actual en formato 'YYYY-MM-DD'
const today = new Date().toISOString().split("T")[0];

const db = getFirestore();
const route = useRoute();
const services = ref([]);
const selectedService = ref(null);
const loading = ref(true);
const error = ref(null);
const citiesList = ref([]);
const selectedCity = ref(null);
const selectedDate = ref(null); // Fecha seleccionada

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
    citiesList.value = []; // Limpiar la lista antes de llenarla
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
  }
};

// Llamar a las funciones al montar el componente
onMounted(() => {
  getAllServices();
  fetchAndStoreCities();
});
</script>

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
</style>
