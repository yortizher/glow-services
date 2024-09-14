<script>
export default {
  data() {
    return {
      tab: null,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },
};
</script>
<template>
  <v-card class="mx-auto" max-width="80%" rounded="lg">
    <v-tabs
      height="50"
      v-model="tab"
      align-tabs="center"
      bg-color="tertiary"
      color="white"
      stacked
    >
      <v-tab value="tab-1">
        <v-icon icon="mdi-calendar-month"></v-icon>
        Fecha
      </v-tab>
      <v-tab value="tab-2">
        <v-icon icon="mdi-clock"></v-icon>
        Hora
      </v-tab>
      <v-tab value="tab-3">
        <v-icon icon="mdi-account-box"></v-icon>
        xxxx
      </v-tab>
    </v-tabs>
    <!-- <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="i in 3"
          :key="i"
          :value="'tab-' + i"
        >
          <v-card>
            <v-card-text>{{ text }}</v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window> -->
  </v-card>
</template>
