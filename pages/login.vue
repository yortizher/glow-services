<script>
  export default {
    data: () => ({
      user: '',
      firstNameRules: [
        value => {
          if (value?.length > 3) return true

          return 'First name must be at least 3 characters.'
        },
      ],
      password: '',
      lastNameRules: [
        value => {
          if (/[^0-9]/.test(value)) return true

          return 'Last name can not contain digits.'
        },
      ],
      visible: false,
    }),
  }
</script>
<template>
    <v-row class="d-flex justify-center ma-0">
        <v-col cols="11" sm="6" md="6" lg="5" xl="5">
            <v-sheet class="mx-auto form-content" width="100%" elevation="2" rounded="lg">
                <v-form fast-fail @submit.prevent >
                    <h2 class="title-login text-primary">Inicia sesión</h2>
                    <v-text-field
                        v-model="user"
                        :rules="firstNameRules"
                        label="Correo Electrónico"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        type="email"
                        class="mt-1"
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        :rules="firstNameRules"
                        label="Contraseña"
                        :type="visible ? 'text' : 'password'"
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        prepend-inner-icon="mdi-lock-outline"
                        variant="outlined"
                        @click:append-inner="visible = !visible"
                        class="mt-1"
                    ></v-text-field>

                    <v-btn class="mt-2 btn-login bg-primary" elevation="0" color="#fff" type="submit" block>Acceder</v-btn>
                    <v-col cols="12" class="d-flex justify-end pa-0">
                      <a class="text-primary recover-password" href="#">¿Olvidaste tu contraseña?</a>
                    </v-col>
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
    margin-top: 10vh;
    padding: 20px 30px;
    .title-login {
        text-align: center;
        font-weight: 700;
        margin-bottom: 20px;
        font-family: 'Montserrat-Medium';
        // background-color: $primary-color;
    }
    .btn-login {
        text-align: center;
        font-weight: 700;
        font-size: 15px;
        margin-bottom: 20px;
        font-family: 'Montserrat-Medium';
        color: #fff !important;
    }
    .recover-password {
      text-decoration: none;
    }
}
</style>