/* ========================================
   FIREBASE CONFIGURATION
   ======================================== */

/**
 * IMPORTANTE: Configuración de Firebase
 *
 * Para usar este proyecto, necesitas crear un proyecto en Firebase:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto
 * 3. Habilita Firestore Database
 * 4. Obtén tu configuración en: Project Settings > General > Your apps
 * 5. Reemplaza los valores de firebaseConfig con los de tu proyecto
 */

const firebaseConfig = {
  apiKey: "AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y",
  authDomain: "frandoweb-4c2c7.firebaseapp.com",
  projectId: "frandoweb-4c2c7",
  storageBucket: "frandoweb-4c2c7.firebasestorage.app",
  messagingSenderId: "227831202965",
  appId: "1:227831202965:web:21256f915db24a08f7c79c",
  measurementId: "G-5B39X54TYY"
};

/**
 * REGLAS DE FIRESTORE RECOMENDADAS (para desarrollo):
 *
 * En Firebase Console > Firestore Database > Rules, usa:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /cars/{carId} {
 *       allow read, write: if true;
 *     }
 *   }
 * }
 *
 * NOTA: Para producción, implementa reglas de seguridad adecuadas
 */

// Inicializar Firebase
let app;
let db;

try {
  // Inicializar la app de Firebase
  app = firebase.initializeApp(firebaseConfig);

  // Obtener referencia a Firestore
  db = firebase.firestore();

  console.log('Firebase inicializado correctamente');
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
  alert('Error al conectar con Firebase. Verifica tu configuración en js/config/firebase-config.js');
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.db = db;
}
