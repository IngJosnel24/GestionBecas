// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);