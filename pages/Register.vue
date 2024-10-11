<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore"; // Importa el store

// Inicializa Firestore
const db = getFirestore();

// Inicializa Firebase Authentication
const auth = getAuth();

const userStore = useUserStore(); // Inicializa el store

// Inicializa Firebase Storage
const storage = getStorage();

const router = useRouter();

const data = reactive({
  name: "",
  email: "",
  phone: "",
  city: null,
  address: "",
  document_type: null,
  document_number: "",
  password: "",
  confirm_password: "",
  id_roles: "",
  profileImage: null, // Agregado: Imagen de perfil
});

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
  profileImage: false, // Agregado: Para el estado de la imagen
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
    v === data.password ||
    "Las contraseñas no coinciden.",
]);

const documentTypeRules = ref([
  (v) =>
    !touched.document_type || !!v || "Debe seleccionar un tipo de documento.",
]);

const cityRules = ref([
  (v) => !touched.city || !!v || "Debe seleccionar una ciudad.",
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

const citiesList = ref([]);
const documentType = ref([]);
const formRef = ref(null); // Referencia para el formulario
const showSnackbar = ref(false);
const textSnackbar = ref("");
const roles = ref([]); // Estado reactivo para los roles
let defaultRoleId = null; // Variable para almacenar el ID del rol predeterminado

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
  const resRoles = await getDocs(collection(db, "rol"));
  resRoles.forEach((doc) => {
    roles.value.push({ text: doc.data().name, value: doc.id });
  });

  if (roles.value.length > 0) {
    // Asigna el rol de "Usuario" como predeterminado
    defaultRoleId =
      roles.value.find((role) => role.text === "Usuario")?.value ||
      roles.value[0].value;
  } else {
    console.error("No se encontraron roles en la base de datos.");
  }
};

// Función para limpiar el formulario
const clearForm = () => {
  Object.keys(data).forEach((key) => {
    if (key === "document_type" || key === "city") {
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
  touched.profileImage = true;
  // Revalidar el formulario
  formRef.value.validate();
};

// Función para manejar el envío del formulario
const setData = async () => {
  // Establecer todos los campos como "tocados" para activar la validación
  Object.keys(touched).forEach((key) => {
    touched[key] = true;
  });

  // Validar el formulario antes de enviar los datos
  const isValid = await formRef.value.validate();

  if (isValid) {
    try {
      // Registro de usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Asignar el rol predeterminado al usuario
      if (defaultRoleId) {
        data.id_roles = defaultRoleId;
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
      }

      // Preparar datos para enviar a Firestore
      const {
        confirm_password,
        password,
        profileImage,
        ...dataToSend
      } = data;

      // Añadir la URL de la imagen de perfil a los datos a enviar
      dataToSend.profileImageUrl = profileImageUrl;

      // Guardar datos del usuario en Firestore
      const newUser = doc(collection(db, "users"), userCredential.user.uid);
      await setDoc(newUser, dataToSend);

      userStore.setUser({
        uid: userCredential.user.uid,
        email: data.email,
        ...dataToSend,
      });
      userStore.setToken(userCredential.user.accessToken);

      showSnackbar.value = true;
      textSnackbar.value = "Usuario creado exitosamente";

      // Limpiar el formulario después de enviar los datos
      clearForm();

      // Redirigir al usuario a la página principal u otra página
      router.push("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        textSnackbar.value = "El correo electrónico ya está en uso.";
      } else if (error.code === "auth/weak-password") {
        textSnackbar.value = "La contraseña es demasiado débil.";
      } else {
        textSnackbar.value = "Error al crear el usuario";
      }
      console.error("Error al registrar el usuario:", error);
      showSnackbar.value = true;
    }
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Verifique los campos del formulario";
  }
};

// Configurar onMounted
onMounted(() => {
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
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="data.password"
                :rules="passwordRules"
                label="Contraseña"
                variant="outlined"
                color="primary"
                class="mt-1"
                type="password"
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
                type="password"
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
