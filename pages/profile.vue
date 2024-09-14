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
      <v-col cols="11" sm="11" md="11" lg="11" xl="11">
        <v-row class="align-center">
          <!-- Columna 1: Avatar -->
          <v-col cols="12" sm="4" md="4" lg="4" xl="4">
            <v-card elevation="2" class="pa-3">
              <v-avatar color="grey" rounded="circle" size="150">
                <v-img
                  src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                  cover
                ></v-img>
              </v-avatar>
            </v-card>
          </v-col>
          <!-- Columna 2: Información -->
          <v-col cols="12" sm="8" md="8" lg="8" xl="8">
            <v-card>
                <h1>Jhon Dow</h1>
                <h1>37</h1>
            </v-card>
          </v-col>
        </v-row>
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
