<template>
  <div class="footer d-flex flex-column">
    <div class="footer-top bg-quaternary d-flex flex-wrap align-center justify-between px-4 py-2">
      <strong class="footer-message">
        ¿Necesitas ayuda con la limpieza? Confía en GlowServices para mantener tu espacio impecable. ¡Contrátanos!
      </strong>

      <div class="footer-icons d-flex align-center">
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-2"
          size="small"
          variant="plain"
        ></v-btn>
      </div>
    </div>

    <div class="footer-bottom bg-primary text-quinary text-center">
      {{ new Date().getFullYear() }} — <strong>GlowServices</strong>
    </div>
    <div class="footer-terms bg-primary text-quinary text-center pt-0">
      <NuxtLink class="link text-quinary" to="/TermsAndConditions"><strong>Términos y Condiciones</strong></NuxtLink>
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

<style scoped>
.footer {
  width: 100%;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.footer-message {
  flex: 1;
  font-size: 16px;
  font-weight: bold;
}

.footer-icons .v-btn {
  color: #fff;
}

.footer-bottom, .footer-terms {
  background-color: var(--v-primary-base);
  color: var(--v-theme-on-primary);
  padding: 8px;
  .link{
    text-decoration: none;
  }
}

.text-quinary {
  color: #fff;
}
</style>
