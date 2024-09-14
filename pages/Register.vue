<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

// Inicializa Firestore
const db = getFirestore();

const data = reactive({
  address: "",
  confirm_password: "",
  document_number: "",
  document_type: "",
  email: "",
  name: "",
  password: "",
  phone: "",
});

const firstNameRules = ref([]);
const documentType = ref([]);

const getDataUsers = async () => {
  const resUser = await getDocs(collection(db, "users"));
  console.log(resUser);
  // resUser.forEach((doc) => {
  //   console.log(doc.data());
  // });
};

const fetchAndStoreDocumentTypes = async () => {
  const resDocumentType = await getDocs(collection(db, "document_type"));
  resDocumentType.forEach((doc) => {
    documentType.value.push(doc.data().name);
  });
  console.log(documentType.value); // Muestra el arreglo actualizado
};

const setData = async () => {
  console.log(data, "entro");

  const newCityRef = doc(collection(db, "users"));

  // later...
  await setDoc(newCityRef, data);
};

onMounted(() => {
  getDataUsers();
  fetchAndStoreDocumentTypes();
});
</script>

<template>
  <v-row class="d-flex justify-center ma-0">
    <v-col cols="11" sm="7" md="7" lg="7" xl="7">
      <v-sheet
        class="mx-auto form-content"
        width="100%"
        elevation="2"
        rounded="lg"
      >
        <v-form >
          <h2 class="title-login text-primary">Registro de Usuarios</h2>
          <v-row class="d-flex justify-center">
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.name"
                :rules="firstNameRules"
                label="Nombre"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo nombre es obligatorio."
              ></v-text-field>
            </v-col>
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.email"
                :rules="firstNameRules"
                label="Correo electrónico"
                variant="outlined"
                color="primary"
                class="mt-1"
                type="email"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo correo electrónico es obligatorio."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-select
                v-model="data.document_type"
                label="Tipo de documento"
                :items="documentType"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo tipo de documento es obligatorio."
              ></v-select>
            </v-col>
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.document_number"
                :rules="firstNameRules"
                label="Número de documento"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo número de documento es obligatorio."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.phone"
                :rules="firstNameRules"
                label="Nuemro de celular"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo número de documento es obligatorio."
              ></v-text-field>
            </v-col>
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.address"
                :rules="firstNameRules"
                label="Dirección"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo dirección es obligatorio."
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.password"
                :rules="firstNameRules"
                label="Contraseña"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo contraseña es obligatorio."
              ></v-text-field>
            </v-col>
            <v-col cols="11" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.confirm_password"
                :rules="firstNameRules"
                label="Confirmar contraseña"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                error-messages="El campo confirmar contraseña es obligatorio."
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            class="mt-2 btn-login bg-primary"
            elevation="0"
            color="#fff"
            block
            @click="setData()"
            >Registrar</v-btn
          >
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}
.form-content {
  margin-top: 5vh;
  padding: 20px 30px;

  .title-login {
    text-align: center;
    font-weight: 700;
    margin-bottom: 20px;
    font-family: "Montserrat-Medium";
  }

  .btn-login {
    text-align: center;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 20px;
    font-family: "Montserrat-Medium";
    color: #fff !important;
  }
}
</style>
