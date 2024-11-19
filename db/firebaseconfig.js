// Importa los módulos necesarios de Firebase
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

// Configuración proporcionada por Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMIWazSe4t5VjyAgCfIp5eI6ymVPvg0BY",
  authDomain: "gestionbecas-8ee03.firebaseapp.com",
  projectId: "gestionbecas-8ee03",
  storageBucket: "gestionbecas-8ee03.firebasestorage.app",
  messagingSenderId: "906740296804",
  appId: "1:906740296804:web:48e228ceae4e24407b8371",
  measurementId: "G-59G5PFN29G"
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

const appFirebase = initializeApp(firebaseConfig);

export {appFirebase, firebase}