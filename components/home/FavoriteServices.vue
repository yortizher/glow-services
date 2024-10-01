<script setup>
import { ref, onMounted } from "vue";
import { getDocs, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

const services = ref([]);

const getDataServices = async () => {
  try {
    const resServices = await getDocs(collection(db, "service_type"));
    services.value = resServices.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Servicios obtenidos:", services.value);
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
  }
};

onMounted(() => {
  getDataServices();
});
</script>
<template>
  <v-row >
    <v-col
      v-for="(item, index) in services"
      :key="index"
      class="mx-auto"
      cols="11"
      sm="5"
      md="4"
      lg="3"
    >
      <v-card>
        <v-img height="250px" :src="item.image" cover></v-img>

        <v-card-title>{{ item.name }}</v-card-title>

        <v-card-subtitle>${{ item.price }}</v-card-subtitle>

        <v-card-actions>
          <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
        </v-card-actions>
      </v-card>
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
</style>
