<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useUserStore } from "@/stores/userStore"; // Importa el store
import { useRouter } from "vue-router";

// Inicializar Firestore, Firebase Authentication y Firebase Storage
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const userStore = useUserStore(); // Inicializa el store
const router = useRouter();

// Objeto reactivo para los datos del formulario
const data = reactive({
  name: "", // Nombre
  email: "", // Correo Electrónico
  phone: "", // Número de celular
  city: null, // Ciudad
  address: "", // Dirección
  document_type: null, // Tipo de documento
  document_number: "", // Número de cédula
  bank_account_number: "", // Número de cuenta bancaria
  id_authentication: "", // Contraseña
  confirm_password: "", // Confirmar contraseña
  services: [], // Servicios seleccionados
  acceptance_terms: false, // Aceptación de términos
  profileImage: null, // Imagen de perfil seleccionada
  id_roles: "", // Role ID
});

// Objeto reactivo para rastrear los campos interactuados
const touched = reactive({
  name: false,
  email: false,
  phone: false,
  city: false,
  address: false,
  document_type: false,
  document_number: false,
  bank_account_number: false,
  id_authentication: false,
  confirm_password: false,
  services: false,
  acceptance_terms: false,
  profileImage: false,
});

// Reglas de validación para los campos del formulario
const nameRules = ref([
  (v) => !touched.name || !!v || "El nombre es obligatorio.",
  (v) =>
    !touched.name ||
    (v && v.length >= 3) ||
    "El nombre debe tener al menos 3 caracteres.",
]);

const emailRules = ref([
  (v) => !touched.email || !!v || "El correo electrónico es obligatorio.",
  (v) =>
    !touched.email ||
    /.+@.+\..+/.test(v) ||
    "El correo electrónico no es válido.",
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

const documentTypeRules = ref([
  (v) =>
    !touched.document_type || !!v || "Debe seleccionar un tipo de documento.",
]);

const cityRules = ref([
  (v) => !touched.city || !!v || "Debe seleccionar una ciudad.",
]);

const documentNumberRules = ref([
  (v) =>
    !touched.document_number || !!v || "El número de cédula es obligatorio.",
  (v) =>
    !touched.document_number ||
    /^[0-9]+$/.test(v) ||
    "El número de cédula debe ser numérico.",
]);

const bankAccountNumberRules = ref([
  (v) =>
    !touched.bank_account_number ||
    !!v ||
    "El número de cuenta bancaria es obligatorio.",
  (v) =>
    !touched.bank_account_number ||
    /^[0-9]+$/.test(v) ||
    "El número de cuenta bancaria debe ser numérico.",
]);

const passwordRules = ref([
  (v) => !touched.id_authentication || !!v || "La contraseña es obligatoria.",
  (v) =>
    !touched.id_authentication ||
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

const servicesRules = ref([
  (v) =>
    !touched.services ||
    (v && v.length > 0) ||
    "Debe seleccionar al menos un servicio.",
]);

const checkboxRules = ref([
  (v) =>
    !touched.acceptance_terms ||
    v ||
    "Debe aceptar los términos de servicio y la política de privacidad.",
]);

// Reglas de validación para la imagen de perfil
const profileImageRules = ref([
  (v) => !touched.profileImage || !!v || "Debe seleccionar una foto de perfil.",
  (v) => {
    if (!touched.profileImage) return true;
    if (!v) return "Debe seleccionar una foto de perfil.";
    const file = Array.isArray(v) ? v[0] : v;
    return (
      (file && file.type && file.type.includes("image/")) ||
      "El archivo debe ser una imagen."
    );
  },
]);

// Tipos de documento, ciudades y servicios disponibles
const citiesList = ref([]);
const documentTypes = ref([]);
const servicesList = ref([]);

// Propiedad computada para verificar si los servicios están cargados
const isServicesListLoaded = computed(() => servicesList.value.length > 0);

// Referencia del formulario y control de snackbar
const formRef = ref(null);
const showSnackbar = ref(false);
const textSnackbar = ref("");
const roles = ref([]); // Estado reactivo para los roles
let defaultRoleId = null;

// Función para obtener las ciudades desde Firestore
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

// Obtener tipos de documento desde Firestore
const fetchAndStoreDocumentTypes = async () => {
  try {
    const resDocumentType = await getDocs(collection(db, "document_type"));
    resDocumentType.forEach((doc) => {
      documentTypes.value.push(doc.data().name);
    });
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
  }
};

// Función para obtener los roles desde Firestore
const fetchRoles = async () => {
  try {
    const resRoles = await getDocs(collection(db, "rol")); // Asegúrate de que "rol" es el nombre correcto de la colección
    resRoles.forEach((doc) => {
      roles.value.push({ text: doc.data().name, value: doc.id });
    });

    if (roles.value.length > 0) {
      defaultRoleId =
        roles.value.find((role) => role.text === "Proveedor")?.value ||
        roles.value[1].value;
    } else {
      console.error("No se encontraron roles en la base de datos.");
    }
  } catch (error) {
    console.error("Error al obtener los roles:", error);
  }
};

// Obtener servicios desde Firestore
const getDataServices = async () => {
  try {
    const resServices = await getDocs(collection(db, "service_type"));
    servicesList.value = resServices.docs.map((doc) => {
      const dataService = doc.data();
      console.log(`Service ID: ${doc.id}, Data:`, dataService); // Log cada servicio
      return {
        title: dataService.name || dataService.serviceName || "Sin nombre",
        value: doc.id,
      };
    });
    console.log("Servicios obtenidos:", servicesList.value);
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
  }
};

// Función para limpiar el formulario después del envío
const clearForm = () => {
  Object.keys(data).forEach((key) => {
    if (key === "services") {
      data[key] = [];
    } else if (key === "acceptance_terms") {
      data[key] = false;
    } else if (key === "document_type" || key === "city") {
      data[key] = null;
    } else if (key === "profileImage") {
      data[key] = null;
    } else {
      data[key] = "";
    }
  });

  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  formRef.value.resetValidation();
};

// Función para manejar el cambio de archivo
const onFileChange = (file) => {
  console.log("Imagen seleccionada:", file);
  touched.profileImage = true;
  // Revalidar el formulario
  formRef.value.validate();
};

// Función para manejar el envío del formulario
const setData = async () => {
  // Marcar todos los campos como interactuados para activar la validación
  Object.keys(touched).forEach((key) => {
    touched[key] = true;
  });

  // Validar el formulario
  const isValid = await formRef.value.validate();

  if (isValid) {
    try {
      // Registrar usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.id_authentication
      );
      console.log("Usuario registrado en Firebase Auth:", userCredential.user);

      // Asignar rol predeterminado
      if (defaultRoleId) {
        data.id_roles = defaultRoleId; // Utilizar el ID del rol predeterminado
      } else {
        console.error("No se pudo asignar un rol predeterminado.");
        showSnackbar.value = true;
        textSnackbar.value = "Error al asignar el rol al usuario";
        return;
      }

      // Subir la imagen de perfil a Firebase Storage
      let profileImageUrl = "";
      if (data.profileImage) {
        const file = Array.isArray(data.profileImage)
          ? data.profileImage[0]
          : data.profileImage;
        const imageRef = storageRef(
          storage,
          `profileImages/${userCredential.user.uid}`
        );
        await uploadBytes(imageRef, file);
        profileImageUrl = await getDownloadURL(imageRef);
        console.log("URL de la imagen de perfil:", profileImageUrl);
      }

      // Preparar datos para enviar a Firestore
      const {
        confirm_password,
        id_authentication,
        profileImage,
        ...dataToSend
      } = data;

      // Añadir la URL de la imagen de perfil a los datos a enviar
      dataToSend.profileImageUrl = profileImageUrl;

      // Guardar datos del usuario en Firestore
      const newUser = doc(collection(db, "users"), userCredential.user.uid);
      await setDoc(newUser, dataToSend);

      // Almacenar los datos del usuario en el store (similar a cómo se hace en el login)
      userStore.setUser({
        uid: userCredential.user.uid,
        email: data.email,
        ...dataToSend,
      });
      userStore.setToken(userCredential.user.accessToken);

      showSnackbar.value = true;
      textSnackbar.value = "Proveedor creado exitosamente";

      // Limpiar el formulario
      clearForm();

      router.push("/");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      showSnackbar.value = true;
      textSnackbar.value = "Error al crear el proveedor";
    }
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Verifique los campos del formulario";
  }
};

// Al montar el componente, obtener tipos de documento, ciudades y servicios
onMounted(() => {
  fetchAndStoreCities();
  fetchAndStoreDocumentTypes();
  getDataServices();
  fetchRoles();
});
</script>

<template>
  <v-row class="d-flex justify-center ma-0">
    <v-col cols="11" sm="7" md="7" lg="7" xl="7">
      <v-sheet
        class="mx-auto form-content-RegisterSupplier"
        width="100%"
        elevation="2"
        rounded="lg"
      >
        <v-form ref="formRef">
          <h2 class="title-login text-primary mb-5">Registro de Proveedor</h2>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.name"
                :rules="nameRules"
                label="Nombre"
                variant="outlined"
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
                label="Correo Electrónico"
                variant="outlined"
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
                :items="documentTypes"
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
                label="Número de cédula"
                variant="outlined"
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
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.address = true"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.phone"
                :rules="phoneRules"
                label="Número de celular"
                variant="outlined"
                class="mt-1"
                type="number"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.phone = true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.bank_account_number"
                :rules="bankAccountNumberRules"
                label="Número de cuenta bancaria"
                variant="outlined"
                class="mt-1"
                type="number"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.bank_account_number = true"
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
                class="mt-1"
                type="password"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.id_authentication = true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.confirm_password"
                :rules="confirmPasswordRules"
                label="Confirmar contraseña"
                variant="outlined"
                class="mt-1"
                type="password"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.confirm_password = true"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Campo para la imagen de perfil -->
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pt-0">
              <v-file-input
                v-model="data.profileImage"
                :rules="profileImageRules"
                label="Foto de perfil"
                variant="outlined"
                accept="image/*"
                prepend-icon="mdi-camera"
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @change="onFileChange"
                @blur="touched.profileImage = true"
              ></v-file-input>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-0 pt-0">
              <div class="text-medium-emphasis mb-2">
                Lee las descripciones de los
                <a class="link text-primary" href="">servicios</a> y elige los que
                puedes ofrecer.
              </div>
              <div v-if="isServicesListLoaded">
                <v-select
                  label="Servicios"
                  :items="servicesList"
                  variant="outlined"
                  v-model="data.services"
                  :rules="servicesRules"
                  item-title="title"
                  item-value="value"
                  multiple
                  persistent-hint
                  color="primary"
                  clearable
                  clear-icon="mdi mdi-close-circle-outline"
                  @blur="touched.services = true"
                ></v-select>
              </div>
              <v-skeleton-loader v-else type="list-item"></v-skeleton-loader>
            </v-col>
          </v-row>
          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-0">
            <v-checkbox
              v-model="data.acceptance_terms"
              :rules="checkboxRules"
              color="primary"
              @change="touched.acceptance_terms = true"
            >
              <template v-slot:label>
                <div>
                  Acepto los
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <a
                        href="#"
                        v-bind="props"
                        @click.stop
                        class="text-primary link-terms"
                      >
                        términos de servicio y la política de privacidad
                      </a>
                    </template>
                    Ver los términos de servicio y la política de privacidad.
                  </v-tooltip>
                  .
                </div>
              </template>
            </v-checkbox>
          </v-col>
          <v-btn
            class="btn-login bg-primary mt-2"
            elevation="0"
            color="#fff"
            block
            @click="setData"
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
.form-content-RegisterSupplier {
  padding: 10px 30px;

  .title-login {
    text-align: center;
    font-weight: 700;
    font-family: "Montserrat-Medium";
  }

  .btn-login {
    text-align: center;
    font-weight: 700;
    font-size: 15px;
    font-family: "Montserrat-Medium";
    color: #fff !important;
  }
  .link {
    text-decoration: none;
  }
}
</style>
