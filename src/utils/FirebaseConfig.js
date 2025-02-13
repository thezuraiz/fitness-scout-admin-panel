// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBiZ-mr547NCCg3aYaQB0nEdd_lSmgZViY",
    authDomain: "fitness-scout-912b1.firebaseapp.com",
    projectId: "fitness-scout-912b1",
    storageBucket: "fitness-scout-912b1.appspot.com",
    messagingSenderId: "634407037380",
    appId: "1:634407037380:web:577e218ebdd2f2bd2f9c91",
    measurementId: "G-Q6CGV4JCQQ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

