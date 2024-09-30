<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Inicializa Firestore
const db = getFirestore();

// Inicializa Firebase Authentication
const auth = getAuth();

const data = reactive({
  name: "",
  email: "",
  phone: "",
  city: null, // Ciudad
  address: "",
  document_type: null, // Asegúrate de que el valor sea null
  document_number: "",
  id_authentication: "",
  confirm_password: "",
  id_roles: "",
});
// confirm_password
// password
const touched = reactive({
  name: false,
  email: false,
  phone: false,
  city: false,
  address: false,
  document_type: false,
  document_number: false,
  password: false,
  confirm_password: false,
});

const firstNameRules = ref([
  (v) => !touched.name || !!v || "El nombre es obligatorio.",
  (v) =>
    !touched.name ||
    (v && v.length <= 50) ||
    "El nombre debe tener menos de 50 caracteres.",
]);

const emailRules = ref([
  (v) => !touched.email || !!v || "El correo electrónico es obligatorio.",
  (v) =>
    !touched.email ||
    /.+@.+\..+/.test(v) ||
    "El correo electrónico no es válido.",
]);

const documentNumberRules = ref([
  (v) =>
    !touched.document_number || !!v || "El número de documento es obligatorio.",
  (v) =>
    !touched.document_number ||
    /^[0-9]+$/.test(v) ||
    "El número de documento debe ser numérico.",
]);

const phoneRules = ref([
  (v) => !touched.phone || !!v || "El número de celular es obligatorio.",
  (v) =>
    !touched.phone ||
    /^[0-9]+$/.test(v) ||
    "El número de celular debe ser numérico.",
]);

const addressRules = ref([
  (v) => !touched.address || !!v || "La dirección es obligatoria.",
]);

const passwordRules = ref([
  (v) => !touched.password || !!v || "La contraseña es obligatoria.",
  (v) =>
    !touched.password ||
    v.length >= 6 ||
    "La contraseña debe tener al menos 6 caracteres.",
]);

const confirmPasswordRules = ref([
  (v) => !touched.confirm_password || !!v || "Debe confirmar la contraseña.",
  (v) =>
    !touched.confirm_password ||
    v === data.id_authentication ||
    "Las contraseñas no coinciden.",
]);

const documentTypeRules = ref([
  (v) =>
    !touched.document_type || !!v || "Debe seleccionar un tipo de documento.",
]);
const cityRules = ref([
  (v) => !touched.city || !!v || "Debe seleccionar una ciudad.",
]);

const citiesList = ref([]);
const documentType = ref([]);
const formRef = ref(null); // Referencia para el formulario
const showSnackbar = ref(false);
const textSnackbar = ref("");
const roles = ref([]); // Estado reactivo para los roles
let firstRol = null; // Variable para almacenar el first rol

const getDataUsers = async () => {
  const resUser = await getDocs(collection(db, "users"));
};

const fetchAndStoreCities = async () => {
  try {
    const resCities = await getDocs(collection(db, "cities"));
    resCities.forEach((doc) => {
      citiesList.value.push(doc.data().name);
    });
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
  }
};

const fetchAndStoreDocumentTypes = async () => {
  const resDocumentType = await getDocs(collection(db, "document_type"));
  resDocumentType.forEach((doc) => {
    documentType.value.push(doc.data().name);
  });
};
const fetchRoles = async () => {
  const resRoles = await getDocs(collection(db, "rol")); // Cambia "rol" por el nombre de la colección en Firestore
  resRoles.forEach((doc) => {
    roles.value.push({ text: doc.data().name, value: doc.id }); // Llena el array de roles
    // console.log(roles.value);
  });

  if (roles.value.length > 0) {
    firstRol = roles.value[0]; // Obtener el primer rol del array
  }
};
const clearForm = () => {
  // Restablecer todos los campos del formulario a sus valores iniciales
  Object.keys(data).forEach((key) => {
    data[key] = key === "document_type" ? null : ""; // Asegura que document_type sea null y los demás campos sean cadenas vacías
  });

  // Restablecer el estado de "touched" para que los mensajes de error desaparezcan
  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  // Resetear la validación del formulario
  formRef.value.resetValidation();
};

const setData = async () => {
  // Establecer todos los campos como "tocados" para activar la validación
  Object.keys(touched).forEach((key) => {
    touched[key] = true;
  });

  // Verificar el estado de formRef antes de validar
  if (!formRef.value) {
    return;
  }

  // Validar el formulario antes de enviar los datos
  const isValid = await formRef.value.validate();

  // Depuración detallada
  if (isValid.valid) {
    // Registro de usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.id_authentication
    );
    console.log("Usuario registrado en Firebase Auth:", userCredential.user);

    // Asignar el primer rol obtenido de la base de datos al usuario
    if (firstRol) {
      data.id_roles = firstRol.value; // Utilizar el ID del primer rol
    } else {
      console.error("No se pudo asignar un rol predeterminado.");
      return;
    }
    // Crear una copia de 'data' sin la propiedad 'confirm_password'
    const { confirm_password, id_authentication, ...dataToSend } = data;

    // Aquí es donde se haría la llamada a Firestore para guardar los datos
    const newUser = doc(collection(db, "users"),userCredential.user.uid);
    await setDoc(newUser, dataToSend); // Enviar 'dataToSend' a Firestore

    console.log(newUser,":()");
    showSnackbar.value = true;
    textSnackbar.value = "Usuario creado exitosamente";
    // Limpiar el formulario después de enviar los datos
    clearForm();
    return;
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Verifique los campos del formulario";
  }
};

// Configurar onMounted
onMounted(() => {
  getDataUsers();
  fetchAndStoreDocumentTypes();
  fetchRoles();
  fetchAndStoreCities();
});
</script>

<template>
  <v-row class="d-flex justify-center ma-0">
    <v-col cols="12" sm="7" md="7" lg="7" xl="7">
      <v-sheet
        class="mx-auto form-content-register"
        width="100%"
        elevation="2"
        rounded="lg"
      >
        <v-form ref="formRef">
          <h2 class="title-login text-primary">Registro de Usuarios</h2>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
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
                @blur="touched.name = true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.email"
                :rules="emailRules"
                label="Correo electrónico"
                variant="outlined"
                color="primary"
                class="mt-1"
                type="email"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.email = true"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-select
                v-model="data.document_type"
                :rules="documentTypeRules"
                label="Tipo de documento"
                :items="documentType"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.document_type = true"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.document_number"
                :rules="documentNumberRules"
                label="Número de documento"
                variant="outlined"
                color="primary"
                type="number"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.document_number = true"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-select
                v-model="data.city"
                :rules="cityRules"
                label="Ciudad"
                :items="citiesList"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.city = true"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.address"
                :rules="addressRules"
                label="Dirección"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.address = true"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pt-0">
              <v-text-field
                v-model="data.phone"
                :rules="phoneRules"
                label="Número de celular"
                variant="outlined"
                color="primary"
                class="mt-1"
                type="number"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.phone = true"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.id_authentication"
                :rules="passwordRules"
                label="Contraseña"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.password = true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.confirm_password"
                :rules="confirmPasswordRules"
                label="Confirmar contraseña"
                variant="outlined"
                color="primary"
                class="mt-1"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.confirm_password = true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            class="mt-2 btn-login bg-primary"
            elevation="0"
            color="#fff"
            block
            @click="setData"
            :disabled="!formRef?.validate()"
          >
            Registrar
          </v-btn>
        </v-form>
      </v-sheet>
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
.form-content-register {
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
