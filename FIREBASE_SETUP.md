# Configuración de Firebase - Instrucciones Paso a Paso

Este documento contiene las instrucciones que **DEBES SEGUIR** para configurar Firebase y que el sistema de autenticación funcione correctamente.

---

## Paso 1: Habilitar Firebase Authentication

### 1.1 Acceder a Firebase Console
1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto "autopremium" (o el nombre que le hayas dado)

### 1.2 Habilitar Email/Password Auth
1. En el menú lateral, ve a **Build** > **Authentication**
2. Click en **Get Started** (si es la primera vez)
3. Ve a la pestaña **Sign-in method**
4. Click en **Email/Password**
5. Activa el toggle **Enable**
6. Click en **Save**

### 1.3 Habilitar Google Sign-In
1. En la misma pestaña **Sign-in method**
2. Click en **Google**
3. Activa el toggle **Enable**
4. Selecciona un **Project support email** del dropdown
5. Click en **Save**

---

## Paso 2: Actualizar Reglas de Firestore

Ve a **Firestore Database** > **Rules** y reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Colección de autos: todos pueden leer, solo admins pueden escribir
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Colección de usuarios: cada usuario solo puede leer/escribir su propio documento
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      // Admins pueden leer todos los usuarios
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Colección de favoritos (si se implementa)
    match /favorites/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Importante:** Click en **Publish** para aplicar los cambios.

---

## Paso 3: Configurar Storage Rules (para imágenes - Fase 2)

Ve a **Storage** > **Rules** y usa:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Solo admins pueden subir imágenes a /cars/
    match /cars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Restricciones de archivos
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024 && // 5MB máximo
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Paso 4: Crear Tu Primer Usuario Admin

### Opción A: Manualmente desde Firebase Console
1. Ve a **Authentication** > **Users**
2. Click en **Add User**
3. Ingresa un email y contraseña
4. Click en **Add User**
5. **Importante:** Ahora debes ir a **Firestore Database**
6. Ve a la colección `users`
7. Busca el documento con el UID del usuario que acabas de crear
8. Edita el campo `role` y ponle el valor: `admin`

### Opción B: Registrarte desde la web
1. Abre tu sitio web
2. Click en "Iniciar Sesión" > "Regístrate"
3. Completa el formulario
4. Luego, en Firebase Console > Firestore Database:
   - Busca tu usuario en la colección `users`
   - Edita el campo `role` y ponle: `admin`

---

## Paso 5: Configurar Custom Claims para Roles (Opcional - Avanzado)

Si quieres usar claims personalizados en lugar de guardar el rol en Firestore, necesitarás Firebase Functions.

### 5.1 Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 5.2 Inicializar Functions
```bash
firebase init functions
```

### 5.3 Crear función para asignar rol admin

En `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Asignar rol admin a un usuario
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Solo el primer admin puede ejecutar esto
  // O puedes ejecutarlo manualmente desde Firebase Console

  const uid = data.uid;

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return { message: `Usuario ${uid} ahora es admin` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 5.4 Deploy de la función
```bash
firebase deploy --only functions
```

### 5.5 Llamar a la función
Desde la consola del navegador (F12):

```javascript
const setAdmin = firebase.functions().httpsCallable('setAdminRole');
setAdmin({ uid: 'TU_USER_UID_AQUI' })
  .then(result => console.log(result.data.message));
```

---

## Paso 6: Verificar que Todo Funciona

1. **Abre tu sitio web**
2. **Click en "Iniciar Sesión"**
3. **Intenta registrarte con un email**
   - Deberías ver el mensaje "Cuenta creada exitosamente"
   - Firebase te enviará un email de verificación (opcional)
4. **Intenta iniciar sesión con Google**
   - Deberías ver el popup de Google
   - Al autorizar, deberías ver tu email en la navegación
5. **Intenta acceder al dashboard**
   - Si NO eres admin, deberías ser redirigido con un error
   - Si SÍ eres admin (después de configurar el rol), deberías poder acceder

---

## Solución de Problemas Comunes

### Error: "auth/operation-not-allowed"
**Solución:** No habilitaste Email/Password o Google en Authentication > Sign-in method

### Error: "Missing or insufficient permissions"
**Solución:** Las reglas de Firestore no están configuradas correctamente. Verifica el Paso 2.

### No aparece botón de Google
**Solución:** Asegúrate de habilitar Google Sign-In en Firebase Console

### El usuario no se guarda en Firestore
**Solución:** Verifica que las reglas de Firestore permitan escritura en la colección `users`

### El usuario puede acceder al dashboard sin ser admin
**Solución:** Verifica que:
1. El documento del usuario en Firestore tiene `role: "admin"`
2. Las reglas de Firestore están publicadas correctamente
3. El usuario cerró sesión y volvió a iniciar sesión después de asignarle el rol

---

## Configuración Adicional Recomendada

### Email Verification (Verificación de Email)
1. Ve a **Authentication** > **Settings** > **User actions**
2. Activa **Email enumeration protection** (protege contra ataques)

### Password Reset Email Template
1. Ve a **Authentication** > **Templates**
2. Personaliza el template de "Password reset"
3. Agrega tu logo y colores de marca

### Authorized Domains
1. Ve a **Authentication** > **Settings** > **Authorized domains**
2. Agrega tu dominio personalizado si vas a deployar en producción

---

## Estado Actual

✅ Código de autenticación implementado
✅ Modal de login/registro creado
✅ Integración con Google Sign-In
✅ Protección de dashboard
⚠️ **PENDIENTE: Configurar Firebase Console (pasos de este documento)**

---

## Próximos Pasos (después de configurar Firebase)

Una vez que hayas completado todos los pasos de este documento:

1. Prueba el sistema de login/registro
2. Crea un usuario admin
3. Verifica que el dashboard solo sea accesible para admins
4. Procede con la Fase 2: Upload de imágenes a Firebase Storage

---

**Última actualización:** 2025-01-17
