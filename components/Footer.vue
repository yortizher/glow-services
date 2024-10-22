<template>
  <div class="d-flex flex-column">
    <div class="bg-quaternary d-flex w-100 align-center px-4">
      <strong>¿Necesitas ayuda con la limpieza? Confía en GlowServices para mantener tu espacio impecable. ¡Contratanos!</strong>

      <v-spacer></v-spacer>

      <v-btn
        v-for="icon in icons"
        :key="icon"
        :icon="icon"
        class="mx-4"
        size="small"
        variant="plain"
      ></v-btn>
    </div>

    <div class="px-4 py-2 bg-primary text-center w-100">
      {{ new Date().getFullYear() }} — <strong>GlowServices</strong>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-instagram',
      ],
    }),
  }
</script>