import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // <-- Importar esto

// ¡IMPORTANTE! Reemplaza esto con TU propia configuración que copiaste de la consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfHS79UNEK_0Jd8L9Q94CVqLSGcKE9vO0",
    authDomain: "pinstick-53add.firebaseapp.com",
    projectId: "pinstick-53add",
    storageBucket: "pinstick-53add.firebasestorage.app",
    messagingSenderId: "913238328784",
    appId: "1:913238328784:web:2af797935447ddcfd3a5d5",
    measurementId: "G-VRV35FK4W0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth y exportarlo para usarlo en otras partes
export const auth = getAuth(app);

// ... export const auth = getAuth(app);

export const db = getFirestore(app); // <-- AÑADIR ESTA LÍNEA AL FINAL