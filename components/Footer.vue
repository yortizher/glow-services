<template>
    <div class="d-flex flex-column">
      <div class="bg-tertiary d-flex w-100 align-center px-4">
        <strong>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores aliquid excepturi fuga corporis ea perspiciatis nesciunt.</strong>

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
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  }
</script>