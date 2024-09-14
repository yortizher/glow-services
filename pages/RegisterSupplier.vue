<script>
export default {
  data: () => ({
    firstName: "",
    firstNameRules: [
      (value) => {
        if (value?.length > 3) return true;

        return "First name must be at least 3 characters.";
      },
    ],
    lastName: "123",
    lastNameRules: [
      (value) => {
        if (/[^0-9]/.test(value)) return true;

        return "Last name can not contain digits.";
      },
    ],

    favorites: [],
    states: [
      "Servicio de limpieza de hogar",
      "Servicio de limpieza para empresas",
      "Servicio de limpieza de ventanas",
      "Servicio de lavado de muebles",
    ],
    checkbox: false,
  }),
};
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
        <v-form fast-fail @submit.prevent>
          <h2 class="title-login text-primary">Registro de Proveedor</h2>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Nombre"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Correo Electrónico"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Numero de celular"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Dirección"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Numero cédula"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Nuemero de cuenta bancaria"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Contraseña"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6" class="pt-0">
              <v-text-field
                v-model="firstName"
                :rules="firstNameRules"
                label="Confirmar contraseña"
                variant="outlined"
                class="mt-1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mt-0 pt-0">
              <div class=" text-medium-emphasis mb-2">
                Lee las descripciones de los <a class="link text-primary" href="">servicios</a>  y elige los que
                puedes ofrecer.
              </div>
              <!-- <label>Lee las descripciones de los servicios y elige los servicios que puedes ofrecer.</span> -->
              <v-select
                label="Servicios"
                :items="states"
                variant="outlined"
                v-model="favorites"
                multiple
                persistent-hint
                color="primary"
              ></v-select>
              <!-- hint="texto debajo de el v-select" -->
            </v-col>
          </v-row>
          <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-0">
            <v-checkbox v-model="checkbox" color="primary">
              <template v-slot:label>
                <div>
                  Acepto los
                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <a
                        href="https://vuetifyjs.com"
                        target="_blank"
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
            class="btn-login bg-primary"
            elevation="0"
            color="#fff"
            type="submit"
            block
            >Acceder</v-btn
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
  .link {
    text-decoration: none;
  }
}
</style>
