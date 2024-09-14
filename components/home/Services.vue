<template>
  <v-row>
    <v-col class="mx-auto" cols="11" sm="5" md="4" lg="3">
      <v-card>
        <v-img
          height="250px"
          src="https://img.freepik.com/foto-gratis/tiro-medio-mujer-gabinete-limpieza_23-2148520963.jpg?t=st=1722827389~exp=1722830989~hmac=6b355624e476503c06eb4573948c37b65051ca70308567a3657e700233032e89&w=740"
          cover
        ></v-img>

        <v-card-title> Servicio de limpieza de hogar </v-card-title>

        <v-card-subtitle> $ 140.000 </v-card-subtitle>

        <v-card-actions>
            <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col class="mx-auto" cols="11" sm="5" md="4" lg="3">
      <v-card>
        <v-img
          height="250px"
          src="https://img.freepik.com/foto-gratis/persona-que-encarga-limpieza-oficinas_23-2149374427.jpg?w=740&t=st=1722825434~exp=1722826034~hmac=a6ab24bf303fd796eff4e4d3476fa454420888208504baf8a4cb9104534338b3"
          cover
        ></v-img>

        <v-card-title> Servicio de limpieza para empresas </v-card-title>

        <v-card-subtitle> $ 160.000 </v-card-subtitle>

        <v-card-actions>
            <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col class="mx-auto" cols="11" sm="5" md="4" lg="3">
      <v-card>
        <v-img
          height="250px"
          src="https://img.freepik.com/foto-gratis/concepto-personas-tareas-domesticas-limpieza-mujer-feliz-guantes-limpieza-ventanas-trapo-spray-limpiador-casa_231208-575.jpg?w=1380&t=st=1722823426~exp=1722824026~hmac=9e768a8a0d5aa2dc093364c13baa443a3c011bdb0ec92c82a0737d37d8286e1b"
          cover
        ></v-img>

        <v-card-title> Servicio de limpieza de ventanas </v-card-title>

        <v-card-subtitle> $ 100.000 </v-card-subtitle>


        <v-card-actions>
            <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col class="mx-auto" cols="11" sm="5" md="4" lg="3">
      <v-card>
        <v-img
          height="250px"
          src="https://img.freepik.com/foto-gratis/sirviente-limpiando-casa_23-2149587685.jpg?t=st=1722827066~exp=1722830666~hmac=34bdea99628be118117479cd2625ee16abe4a3c73ed2669bf64d89ca61b5d07c&w=740"
          cover
        ></v-img>

        <v-card-title> Servicio de lavado de muebles </v-card-title>
        <v-card-subtitle> $ 100.000 </v-card-subtitle>
        <v-card-actions>
            <v-btn class="bg-primary btn-services" block>Mas información</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    show: false,
  }),
};
</script>
<style lang="scss">
* {
  font-family: "Montserrat-Medium";
}
.btn-services {
    color: $quinary-color !important;
    font-family: "Montserrat-Medium";
    text-transform: capitalize;
    font-size: 17px;
}
</style>
