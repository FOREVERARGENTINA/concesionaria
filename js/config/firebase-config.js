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
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
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
