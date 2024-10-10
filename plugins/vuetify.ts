import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";

import { VDateInput } from 'vuetify/labs/VDateInput'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#1ed5b9",
    secondary: "#0ab5e1",
    tertiary: "#007bfa",
    quaternary: "#1237a9",
    quinary: "#fff",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    "surface-bright": "#FFFFFF",
    "surface-light": "#EEEEEE",
    "surface-variant": "#424242",
    "on-surface-variant": "#EEEEEE",
    "primary-darken-1": "#1F5592",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
  variables: {
    "border-color": "#000000",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.6,
    "disabled-opacity": 0.38,
    "idle-opacity": 0.04,
    "hover-opacity": 0.04,
    "focus-opacity": 0.12,
    "selected-opacity": 0.08,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.12,
    "dragged-opacity": 0.08,
    "theme-kbd": "#212529",
    "theme-on-kbd": "#FFFFFF",
    "theme-code": "#F5F5F5",
    "theme-on-code": "#000000",
  },
};
const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#fff",
    secondary: "fff",
    tertiary: "fff",
    quaternary: "fff",
    quinary: "dark",
    background: "#1c2b3a" // Agrega esta línea

  },
  variables: {
    "border-color": "#000000"
  }
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VDateInput,
    },
    theme: {
      defaultTheme: "myCustomLightTheme",
      themes: {
        myCustomLightTheme,
        myCustomDarkTheme
      },
    },
  });
  app.vueApp.use(vuetify);
});