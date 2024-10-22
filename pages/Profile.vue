<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged, // Importamos onAuthStateChanged
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userStore";

// Inicializar Firestore, Firebase Authentication y Firebase Storage
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const router = useRouter();
const userStore = useUserStore();

// Crear una referencia reactiva para el usuario
const user = ref(null);
const isLoading = ref(true); // Estado de carga

// Objeto reactivo para los datos del formulario
const data = reactive({
  name: "",
  email: "",
  phone: "",
  city: null,
  address: "",
  document_type: null,
  document_number: "",
  bank_account_number: "",
  services: [],
  profileImage: null,
  id_roles: "",
  profileImageUrl: "",
  description: "",
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
  services: false,
  profileImage: false,
  description: false,
});

// Reglas de validación
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

const servicesRules = ref([
  (v) =>
    !touched.services ||
    (v && v.length > 0) ||
    "Debe seleccionar al menos un servicio.",
]);

// Reglas de validación para la imagen de perfil
const profileImageRules = ref([
  (v) => !touched.profileImage || true, // La imagen de perfil es opcional
  (v) => {
    if (!touched.profileImage) return true;
    if (!v) return true; // La imagen puede ser null
    const file = Array.isArray(v) ? v[0] : v;
    return (
      (file && file.type && file.type.includes("image/")) ||
      "El archivo debe ser una imagen."
    );
  },
]);

// Campos adicionales para la contraseña
const newPassword = ref("");
const confirmPassword = ref("");
const passwordRulesChange = ref([
  (v) => !v || !!v || "La contraseña es obligatoria.",
  (v) =>
    !v || v.length >= 6 || "La contraseña debe tener al menos 6 caracteres.",
]);
const confirmPasswordRulesChange = ref([
  (v) => !v || !!v || "Debe confirmar la contraseña.",
  (v) => !v || v === newPassword.value || "Las contraseñas no coinciden.",
]);

const descriptionRules = ref([
  (v) => !touched.description || !!v || "La descripción es obligatoria.",
  (v) =>
    !touched.description ||
    (v && v.length >= 500) ||
    "La descripción debe tener al menos 500 caracteres.",
  (v) =>
    !touched.description ||
    (v && v.length <= 700) ||
    "La descripción debe tener menos de 700 caracteres.",
]);

// Lista de ciudades, tipos de documento y servicios
const citiesList = ref([]);
const documentTypes = ref([]);
const servicesList = ref([]);

// Propiedad computada para verificar si los servicios están cargados
const isServicesListLoaded = computed(() => servicesList.value.length > 0);

// Referencia del formulario y control de snackbar
const formRef = ref(null);
const showSnackbar = ref(false);
const textSnackbar = ref("");

// Variables para los diálogos
const reauthDialog = ref(false);
const reauthPassword = ref("");
const actionAfterReauth = ref(null);

const confirmDeleteDialog = ref(false);

// Función para obtener los datos del usuario desde Firestore
const fetchUserData = async () => {
  try {
    const userDoc = await getDoc(doc(db, "users", user.value.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Asignar los datos al objeto reactivo
      data.name = userData.name || "";
      data.email = userData.email || user.value.email || "";
      data.phone = userData.phone || "";
      data.city = userData.city || null;
      data.address = userData.address || "";
      data.document_type = userData.document_type || null;
      data.document_number = userData.document_number || "";
      data.bank_account_number = userData.bank_account_number || "";
      data.services = userData.services || [];
      data.id_roles = userData.id_roles || "";
      data.profileImageUrl = userData.profileImageUrl || "";
      data.description = userData.description || "";
    } else {
      console.error("No se encontraron datos del usuario en Firestore.");
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
  }
};

// Funciones para obtener las ciudades, tipos de documento y servicios
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
  try {
    const resDocumentType = await getDocs(collection(db, "document_type"));
    resDocumentType.forEach((doc) => {
      documentTypes.value.push(doc.data().name);
    });
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
  }
};

const getDataServices = async () => {
  try {
    const resServices = await getDocs(collection(db, "service_type"));
    servicesList.value = resServices.docs.map((doc) => {
      const dataService = doc.data();
      return {
        title: dataService.name || dataService.serviceName || "Sin nombre",
        value: doc.id,
      };
    });
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
  }
};

// Función para manejar el cambio de archivo
const onFileChange = (file) => {
  touched.profileImage = true;
  // Revalidar el formulario
  formRef.value.validate();
};

// Función para manejar la actualización de datos
const updateData = async () => {
  // Marcar los campos como interactuados para activar la validación
  Object.keys(touched).forEach((key) => {
    touched[key] = true;
  });

  // Validar el formulario
  const isValid = await formRef.value.validate();

  // Validar las contraseñas si se ingresan
  let isPasswordValid = true;
  if (newPassword.value || confirmPassword.value) {
    isPasswordValid =
      passwordRulesChange.value.every(
        (rule) => rule(newPassword.value) === true
      ) &&
      confirmPasswordRulesChange.value.every(
        (rule) => rule(confirmPassword.value) === true
      );
    if (!isPasswordValid) {
      showSnackbar.value = true;
      textSnackbar.value = "Verifique las contraseñas ingresadas";
    }
  }

  if (isValid && isPasswordValid) {
    try {
      // Si se va a cambiar la contraseña o el email, se necesita reautenticación
      if (newPassword.value || data.email !== user.value.email) {
        actionAfterReauth.value = "updateData";
        reauthDialog.value = true;
      } else {
        // Actualizar datos sin cambiar la contraseña o email
        await performUpdateData();
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      showSnackbar.value = true;
      textSnackbar.value = "Error al actualizar los datos";
    }
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Verifique los campos del formulario";
  }
};

// Función para realizar la actualización de datos
const performUpdateData = async () => {
  // Actualizar email en Firebase Auth si cambió
  if (data.email !== user.value.email) {
    await updateEmail(user.value, data.email);
  }

  // Actualizar contraseña si se ingresó una nueva
  if (newPassword.value) {
    await updatePassword(user.value, newPassword.value);
  }

  // Subir la imagen de perfil a Firebase Storage si cambió
  let profileImageUrl = data.profileImageUrl;
  if (data.profileImage) {
    // Si ya hay una imagen, eliminarla
    if (profileImageUrl) {
      const oldImageRef = storageRef(
        storage,
        `profileImages/${user.value.uid}`
      );
      await deleteObject(oldImageRef);
    }
    const file = Array.isArray(data.profileImage)
      ? data.profileImage[0]
      : data.profileImage;
    const imageRef = storageRef(storage, `profileImages/${user.value.uid}`);
    await uploadBytes(imageRef, file);
    profileImageUrl = await getDownloadURL(imageRef);
  }

  // Preparar datos para actualizar en Firestore
  const dataToUpdate = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    address: data.address,
    document_type: data.document_type,
    document_number: data.document_number,
    bank_account_number: data.bank_account_number,
    services: data.services,
    id_roles: data.id_roles,
    profileImageUrl: profileImageUrl,
    description: data.description,
  };

  // Actualizar datos del usuario en Firestore
  const userRef = doc(db, "users", user.value.uid);
  await updateDoc(userRef, dataToUpdate);

  showSnackbar.value = true;
  textSnackbar.value = "Datos actualizados exitosamente";

  // Reiniciar touched
  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  // Limpiar los campos de contraseña
  newPassword.value = "";
  confirmPassword.value = "";
};

// Función para manejar la reautenticación
const handleReauthentication = async () => {
  if (!reauthPassword.value) {
    showSnackbar.value = true;
    textSnackbar.value = "Por favor, ingresa tu contraseña actual.";
    return;
  }
  try {
    const credential = EmailAuthProvider.credential(
      user.value.email,
      reauthPassword.value
    );
    await reauthenticateWithCredential(user.value, credential);
    reauthDialog.value = false;
    reauthPassword.value = "";

    if (actionAfterReauth.value === "updateData") {
      await performUpdateData();
    } else if (actionAfterReauth.value === "deleteAccount") {
      await performDeleteAccount();
    }
  } catch (error) {
    console.error("Error en la reautenticación:", error);
    showSnackbar.value = true;
    textSnackbar.value = "Contraseña incorrecta";
    reauthPassword.value = "";
  }
};

// Función para eliminar la cuenta del usuario
const deleteAccount = () => {
  // Abrir el diálogo de confirmación
  confirmDeleteDialog.value = true;
};

// Función para realizar la eliminación de la cuenta
const performDeleteAccount = async () => {
  try {
    // Eliminar la imagen de perfil de Firebase Storage
    if (data.profileImageUrl) {
      const imageRef = storageRef(storage, `profileImages/${user.value.uid}`);
      await deleteObject(imageRef);
    }

    // Eliminar el documento del usuario en Firestore
    await deleteDoc(doc(db, "users", user.value.uid));

    // Eliminar el usuario de Firebase Auth
    await deleteUser(user.value);
    userStore.clearUser();

    showSnackbar.value = true;
    textSnackbar.value = "Cuenta eliminada exitosamente";

    // Redirigir al usuario al inicio de sesión u otra página
    router.push("/login");
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    showSnackbar.value = true;
    textSnackbar.value = "Error al eliminar la cuenta";
  }
};

// Al montar el componente, utilizar onAuthStateChanged para manejar el estado de autenticación
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    isLoading.value = false;
    if (currentUser) {
      user.value = currentUser;
      // Llamar a las funciones que dependen del usuario autenticado
      fetchUserData();
      fetchAndStoreCities();
      fetchAndStoreDocumentTypes();
      getDataServices();
    } else {
      // Si no hay usuario autenticado, redirigir al inicio de sesión
      router.push("/login");
    }
  });
});
</script>

<template>
  <v-row class="d-flex justify-center ma-0">
    <v-col cols="11" sm="7" md="7" lg="7" xl="7">
      <v-sheet
        class="mx-auto form-content-Profile"
        width="100%"
        elevation="2"
        rounded="lg"
      >
        <v-form ref="formRef">
          <h2 class="title-login text-primary">Tu Perfil</h2>
          <v-col v-if="data.profileImageUrl" class="d-flex justify-center mb-2">
            <v-avatar
              :image="data.profileImageUrl"
              size="200"
              variant="outlined"
              color="primary"
            ></v-avatar>
          </v-col>
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
            <v-col
              :cols="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs' ? 6 : 12"
              :sm="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs' ? 6 : 12"
              :md="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs' ? 6 : 12"
              :lg="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs' ? 6 : 12"
              :xl="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs' ? 6 : 12"
              class="pt-0"
            >
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
            <v-col
              v-if="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs'"
              cols="12"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="pt-0"
            >
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

          <!-- Campo para la imagen de perfil -->
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pt-0">
              <v-file-input
                v-model="data.profileImage"
                label="Foto de perfil"
                variant="outlined"
                accept="image/*"
                prepend-icon="mdi-camera"
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @change="onFileChange"
                @blur="touched.profileImage = true"
              ></v-file-input>
              <!-- Mostrar la imagen actual -->
            </v-col>
          </v-row>

          <v-row v-if="data.id_roles === 'BrRcZz4BfmEKcUAhDQrs'">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-0 pt-0">
              <div class="text-medium-emphasis mb-2">
                Lee las descripciones de los
                <NuxtLink class="link text-primary" to="/Menu"
                  >servicios</NuxtLink
                >
                y elige los que puedes ofrecer.
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

          <v-row v-if="data.description">
            <v-col cols="12">
              <v-textarea
                v-model="data.description"
                :rules="descriptionRules"
                label="Descripción"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.description = true"
              ></v-textarea>
            </v-col>
          </v-row>

          <!-- Sección para cambiar la contraseña -->
          <v-row>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-text-field
                v-model="newPassword"
                :rules="passwordRulesChange"
                label="Nueva contraseña"
                variant="outlined"
                type="password"
                clearable
                clear-icon="mdi mdi-close-circle-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRulesChange"
                label="Confirmar nueva contraseña"
                variant="outlined"
                type="password"
                clearable
                clear-icon="mdi mdi-close-circle-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Botones -->
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-btn
                class="bg-primary btn-save text-quinary mt-2"
                elevation="0"
                block
                @click="updateData"
              >
                Guardar Cambios
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-btn
                class="btn-delete bg-red mt-2"
                elevation="0"
                color="#fff"
                block
                @click="deleteAccount"
              >
                Eliminar Cuenta
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- Snackbar -->
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

  <!-- Diálogo de reautenticación -->
  <v-dialog
    class="dialog-content"
    v-model="reauthDialog"
    persistent
    max-width="400"
  >
    <v-card>
      <h3 class="title text-center mt-2 text-primary">
        Reautenticación requerida
      </h3>
      <v-card-text class="mb-0 pb-0">
        <p class="description mb-3">
          Por favor, ingresa tu contraseña actual para continuar.
        </p>
        <v-text-field
          v-model="reauthPassword"
          label="Contraseña"
          type="password"
          variant="outlined"
          color="primary"
          clearable
          required
          :rules="[(v) => !!v || 'La contraseña es obligatoria.']"
        ></v-text-field>
        <v-card-actions class="d-flex justify-space-between pa-0">
          <v-btn
            class="bg-primary btn-dialog"
            color="quinary"
            :disabled="!reauthPassword"
            @click="handleReauthentication"
          >
            Aceptar
          </v-btn>
          <v-btn
            class="bg-red btn-dialog"
            color="quinary"
            @click="reauthDialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Diálogo de confirmación para eliminar cuenta -->
  <v-dialog
    class="dialog-content"
    v-model="confirmDeleteDialog"
    persistent
    max-width="400"
  >
    <v-card>
      <h3 class="title text-center mt-2 text-primary">Confirmar eliminación</h3>
      <v-card-text class="mb-0 pb-0">
        <p class="description">
          ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
          puede deshacer.
        </p>
        <v-card-actions class="d-flex justify-space-between mt-2 pa-0">
          <v-btn
            class="bg-primary"
            color="quinary"
            @click="confirmDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            class="bg-red"
            color="quinary"
            @click="
              confirmDeleteDialog = false;
              actionAfterReauth = 'deleteAccount';
              reauthDialog = true;
            "
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}
.form-content-Profile {
  padding: 20px 30px;

  .title-login {
    text-align: center;
    font-weight: 700;
    font-family: "Montserrat-Medium";
  }

  .subtitle {
    font-weight: 600;
  }

  .btn-delete,
  .btn-save {
    text-align: center;
    font-weight: 700;
    font-size: 15px;
    font-family: "Montserrat-Medium";
  }

  .link {
    text-decoration: none;
  }
}
</style>
