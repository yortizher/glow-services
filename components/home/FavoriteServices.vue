<script setup>
import { ref, onMounted } from "vue";
import { getDocs, collection, getFirestore } from "firebase/firestore";

// Inicializa la conexión a Firestore
const db = getFirestore();

// Define la variable reactiva que almacenará los servicios
const services = ref([]);

// Función para obtener los servicios desde Firestore
const getDataServices = async () => {
  try {
    const resServices = await getDocs(collection(db, "service_type"));
    services.value = resServices.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((service) => service.important === true); // Filtrar solo los que tienen "important" en true
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
  }
};

// Llama a la función cuando el componente se monte
onMounted(() => {
  getDataServices();
});
</script>

<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <h1 class="title-services text-primary">
        Nuestros servicios principales
      </h1>
    </v-col>
    <v-col
      v-for="(item, index) in services"
      :key="index"
      class="mx-auto"
      cols="11"
      sm="5"
      md="4"
      lg="3"
    >
      <NuxtLink :to="`/Services/` + item.name" class="link-content">
        <v-card>
          <v-img height="250px" :src="item.image" cover></v-img>

          <v-card-title>{{ item.name }}</v-card-title>

          <v-card-subtitle>${{ item.price }}</v-card-subtitle>

          <v-card-actions>
            <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
          </v-card-actions>
        </v-card>
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    show: false,
  }),
};
</script>

<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}
.btn-services {
  color: $quinary-color !important;
  font-family: "Montserrat-Medium";
  text-transform: capitalize;
  font-size: 17px;
}
.title-services {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
}
.link-content {
  text-decoration: none;
}
</style>
