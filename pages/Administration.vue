<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

// Estado reactivo para manejar los datos del servicio
const service = reactive({
  id: "",
  name: "",
  description: "",
  price: 0,
  important: false,
  imageFile: null, // Campo para el archivo de imagen
  imageUrl: "", // URL de la imagen para mostrar en la lista
});

// Estado para la lista de servicios y control de edición
const services = ref([]);
const isEditing = ref(false);
const formRef = ref(null);
const touched = reactive({ imageFile: false }); // Estado para seguimiento del campo de imagen

// Estado para el control del snackbar
const showSnackbar = ref(false);
const snackbarText = ref("");
const timeout = ref(3000);

// Estado para el control del diálogo de confirmación
const showDeleteDialog = ref(false);
const serviceToDelete = ref(null); // Almacena el servicio a eliminar

// Encabezados para la tabla de servicios
const headers = [
  { text: "Nombre", value: "name" },
  { text: "Precio", value: "price" },
  { text: "Descripción", value: "description" },
  { text: "Acciones", value: "actions", sortable: false },
];

// Obtener la lista de servicios desde Firestore
const fetchServices = async () => {
  const querySnapshot = await getDocs(collection(db, "service_type"));
  services.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Función para manejar el cambio de archivo de imagen
const onFileChange = (file) => {
  service.imageFile = Array.isArray(file) ? file[0] : file;
};

// Función para guardar un servicio (crear o actualizar)
const saveService = async () => {
  try {
    if (!service.name || !service.description || !service.price) {
      snackbarText.value = "Por favor, complete todos los campos.";
      showSnackbar.value = true;
      return;
    }

    let imageUrl = service.imageUrl;

    // Subir la imagen al almacenamiento si se seleccionó una nueva imagen
    if (service.imageFile) {
      const fileRef = storageRef(storage, `serviceImages/${service.name}`);
      await uploadBytes(fileRef, service.imageFile);
      imageUrl = await getDownloadURL(fileRef);
    }

    const serviceData = {
      name: service.name,
      description: service.description,
      price: service.price,
      important: service.important,
      image: imageUrl,
    };

    if (isEditing.value) {
      // Actualizar el servicio existente
      await updateDoc(doc(db, "service_type", service.id), serviceData);
      snackbarText.value = "Servicio actualizado correctamente";
    } else {
      // Crear un nuevo servicio
      await setDoc(doc(collection(db, "service_type")), serviceData);
      snackbarText.value = "Servicio creado correctamente";
    }

    // Limpiar el formulario
    resetForm();
    fetchServices();
  } catch (error) {
    snackbarText.value = `Error: ${error.message}`;
  } finally {
    showSnackbar.value = true;
  }
};

// Función para editar un servicio
const editService = (item) => {
  service.id = item.id;
  service.name = item.name;
  service.description = item.description;
  service.price = item.price;
  service.important = item.important;
  service.imageUrl = item.image;
  isEditing.value = true;
};

// Función para mostrar el diálogo de confirmación de eliminación
const confirmDeleteService = (id) => {
  serviceToDelete.value = id;
  showDeleteDialog.value = true;
};

// Función para eliminar un servicio
const deleteService = async () => {
  if (serviceToDelete.value) {
    await deleteDoc(doc(db, "service_type", serviceToDelete.value));
    snackbarText.value = "Servicio eliminado correctamente";
    showSnackbar.value = true;
    fetchServices();
    serviceToDelete.value = null;
    showDeleteDialog.value = false;
  }
};

// Función para cancelar la edición
const cancelEdit = () => {
  resetForm();
};

// Función para limpiar el formulario
const resetForm = () => {
  service.id = "";
  service.name = "";
  service.description = "";
  service.price = 0;
  service.important = false;
  service.imageFile = null;
  service.imageUrl = "";
  isEditing.value = false;
};

// Obtener los servicios al montar el componente
onMounted(() => {
  fetchServices();
});

definePageMeta({
  middleware: "admin",
});
</script>

<template>
  <v-container>
    <h1 class="text-center text-primary mb-5">Gestión de Servicios</h1>
    <v-form ref="formRef">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="service.name"
            label="Nombre del Servicio"
            variant="outlined"
            color="primary"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="service.price"
            label="Precio del Servicio"
            variant="outlined"
            color="primary"
            type="number"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="service.description"
            label="Descripción del Servicio"
            variant="outlined"
            color="primary"
            rows="2"
            required
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-file-input
            v-model="service.imageFile"
            label="Imagen del Servicio"
            accept="image/*"
            color="primary"
            prepend-icon="mdi-camera"
            @change="onFileChange"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-checkbox
            v-model="service.important"
            label="Importante"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            class="mr-2 text-quinary custom-btn-save"
            color="primary"
            @click="saveService"
            >Guardar Servicio</v-btn
          >
          <v-btn
            class="ml-2 custom-btn-cancel"
            color="red"
            v-if="isEditing"
            @click="cancelEdit"
            >Cancelar</v-btn
          >
        </v-col>
      </v-row>
    </v-form>

    <!-- Lista de servicios existentes -->
    <v-row>
      <v-col cols="12">
        <v-data-table :items="services" :headers="headers" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-icon small class="edit-icon" @click="editService(item)"
              >mdi-pencil</v-icon
            >
            <v-icon
              small
              class="delete-icon ml-4"
              @click="confirmDeleteService(item.id)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Dialogo de confirmación para eliminar -->
    <v-dialog v-model="showDeleteDialog" persistent max-width="500px">
      <v-card>
        <h2 class="title text-center mt-2 text-primary"
          >Confirmar Eliminación</h2
        >
        <v-card-text class="description mb-3"
          >¿Estás seguro de que deseas eliminar este servicio?</v-card-text
        >
        <v-card-actions class="d-flex justify-space-between">
          <v-btn
            class="bg-primary btn-dialog"
            color="quinary"
            text
            @click="showDeleteDialog = false"
            >Cancelar</v-btn
          >
          <v-btn  class="bg-red btn-dialog" color="quinary" text @click="deleteService">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de notificaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="timeout"
      color="tertiary"
      location="top"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}

.custom-btn-save,
.custom-btn-cancel {
  font-weight: bold;
  font-family: "Montserrat-Medium";
}

.edit-icon,
.delete-icon {
  cursor: pointer;
  transition: transform 0.3s;
}

.edit-icon:hover {
  transform: scale(1.2);
  color: #4caf50; /* Color verde para edición */
}

.delete-icon:hover {
  transform: scale(1.2);
  color: #f44336; /* Color rojo para eliminación */
}

.ml-4 {
  margin-left: 16px; /* Aumentar margen entre iconos */
}
</style>
