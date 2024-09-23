import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYUA8ZyNePgngqMISB7uTVPQr1FkDpyMo",
  authDomain: "glow-services.firebaseapp.com",
  projectId: "glow-services",
  storageBucket: "glow-services.appspot.com",
  messagingSenderId: "904204852399",
  appId: "1:904204852399:web:9836707aeb9e42b595885a",
  measurementId: "G-YQM3272C8R"
};

export default defineNuxtPlugin((nuxtApp) => {

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const auth = getAuth(app);
  nuxtApp.provide('db', db);
});