<script setup>
import { ref, reactive } from "vue";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore"; // Importa tu store

const db = getFirestore();
const auth = getAuth();
const router = useRouter();
const userStore = useUserStore(); // Instancia del store

// Datos reactivos del formulario
const data = reactive({
  email: "",
  password: "",
  resetEmail: "", // Campo para el correo de recuperación
});

// Campos tocados para activar la validación
const touched = reactive({
  email: false,
  password: false,
  resetEmail: false,
});

// Reglas de validación
const emailRules = ref([
  (v) => !touched.email || !!v || "El correo electrónico es obligatorio.",
  (v) =>
    !touched.email ||
    /.+@.+\..+/.test(v) ||
    "El correo electrónico no es válido.",
]);

const passwordRules = ref([
  (v) => !touched.password || !!v || "La contraseña es obligatoria.",
  (v) =>
    !touched.password ||
    v.length >= 6 ||
    "La contraseña debe tener al menos 6 caracteres.",
]);

const resetEmailRules = ref([
  (v) => !touched.resetEmail || !!v || "El correo electrónico es obligatorio.",
  (v) =>
    !touched.resetEmail ||
    /.+@.+\..+/.test(v) ||
    "El correo electrónico no es válido.",
]);

const formRef = ref(null); // Referencia para el formulario
const resetFormRef = ref(null); // Referencia para el formulario de recuperación
const showSnackbar = ref(false);
const textSnackbar = ref("");
const dataUserCredential = ref([]);

// Función para limpiar el formulario después del login
const clearForm = () => {
  data.email = "";
  data.password = "";

  Object.keys(touched).forEach((key) => {
    touched[key] = false;
  });

  formRef.value.resetValidation();
};

// Función para limpiar el formulario de recuperación de contraseña
const clearResetForm = () => {
  data.resetEmail = "";
  touched.resetEmail = false;
  if (resetFormRef.value) {
    resetFormRef.value.resetValidation();
  }
};

// Función para obtener datos del usuario desde Firestore
const getUserFromFirestore = async (uid) => {
  try {
    const userRef = doc(db, "users", uid); // Referencia al documento del usuario en la colección "users"
    const userSnap = await getDoc(userRef); // Usar getDoc para un solo documento
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Función de login
const login = async () => {
  // Establecer los campos como "tocados" para activar la validación
  touched.email = true;
  touched.password = true;

  // Validar el formulario antes de proceder con el login
  const isValid = await formRef.value.validate();

  if (isValid) {
    try {
      // Autenticar al usuario con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      dataUserCredential.value = userCredential; // Almacenar la credencial del usuario en una variable

      // Obtener datos adicionales del usuario desde Firestore
      const userData = await getUserFromFirestore(userCredential.user.uid);

      if (userData) {
        userStore.setUser(userData); // Guardar los datos del usuario en el store
        userStore.setToken(userCredential.user.accessToken); // Guardar el token si es necesario
        showSnackbar.value = true;
        textSnackbar.value = "¡Has iniciado sesión correctamente!";
      } else {
        showSnackbar.value = true;
        textSnackbar.value =
          "No se encontraron datos adicionales para este usuario.";
      }

      clearForm();
      router.push({ path: "/" }); // Redirigir al usuario tras el login
    } catch (error) {
      showSnackbar.value = true;
      textSnackbar.value = "Las credenciales ingresadas no son válidas.";
      console.error("Error durante el login:", error);
    }
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Verifique los campos del formulario";
  }
};

const resetPassword = async () => {
  touched.resetEmail = true;

  // Validar el formulario de recuperación
  const isValid = await resetFormRef.value.validate();

  if (isValid) {
    try {
      await sendPasswordResetEmail(auth, data.resetEmail); // Enviar correo de restablecimiento
      showSnackbar.value = true;
      textSnackbar.value = "Correo de restablecimiento de contraseña enviado.";
      clearResetForm();
    } catch (error) {
      showSnackbar.value = true;
      textSnackbar.value = "Error al enviar el correo de restablecimiento.";
      console.error("Error al enviar el correo de restablecimiento:", error);
    }
  } else {
    showSnackbar.value = true;
    textSnackbar.value = "Por favor, ingresa un correo electrónico válido.";
  }
};
</script>

<template>
  <v-row class="d-flex justify-center ma-0">
    <v-col cols="11" sm="6" md="6" lg="5" xl="5">
      <v-sheet
        class="mx-auto form-content-login"
        width="100%"
        elevation="2"
        rounded="lg"
      >
        <v-form ref="formRef">
          <h2 class="title-login text-primary">Inicia sesión</h2>
          <v-row>
            <v-col cols="12" class="pt-0">
              <v-text-field
                v-model="data.email"
                :rules="emailRules"
                label="Correo Electrónico"
                variant="outlined"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.email = true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pt-0">
              <v-text-field
                v-model="data.password"
                :rules="passwordRules"
                label="Contraseña"
                variant="outlined"
                type="password"
                color="primary"
                required
                clearable
                clear-icon="mdi mdi-close-circle-outline"
                @blur="touched.password = true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-btn
            class="mt-2 btn-login bg-primary"
            elevation="0"
            color="#fff"
            block
            @click="login"
          >
            Iniciar sesión
          </v-btn>
        </v-form>

        <v-col cols="12" class="ma-0 pa-0 d-flex justify-end align-center">
          <v-dialog transition="dialog-top-transition" width="500">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                text="¿Olvidaste tu contraseña?"
                class="text-primary ma-0 pa-0"
                variant="text"
              ></v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-text>
                  <h3 class="text-center text-primary">Recuperar contraseña</h3>
                  <v-form ref="resetFormRef">
                    <v-col cols="12" class="d-flex justify-center align-center my-5 pa-0">
                      <v-text-field
                        v-model="data.resetEmail"
                        :rules="resetEmailRules"
                        label="Correo Electrónico"
                        variant="outlined"
                        color="primary"
                        required
                        clearable
                        type="email"
                        clear-icon="mdi mdi-close-circle-outline"
                        @blur="touched.resetEmail = true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pa-0 ma-0">
                      <v-btn
                        class="mt-2 mb-0 pb-0 btn-dialog bg-primary"
                        elevation="0"
                        color="#fff"
                        block
                        @click="resetPassword"
                      >
                        Recuperar
                      </v-btn>
                    </v-col>
                  </v-form>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
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
.form-content-login {
  margin-top: 10vh;
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
.btn-dialog {
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 20px;
  font-family: "Montserrat-Medium";
  color: #fff !important;
}
</style>
