/* ========================================
   AUTH MODULE - Firebase Authentication
   ======================================== */

const AuthModule = {
  currentUser: null,
  authInitialized: false,

  /**
   * Inicializa el módulo de autenticación
   */
  async init() {
    if (!window.firebase || !window.firebase.auth) {
      console.error('Firebase Auth no está disponible');
      return;
    }

    // Observar cambios en el estado de autenticación
    firebase.auth().onAuthStateChanged(async (user) => {
      this.authInitialized = true;
      this.currentUser = user;

      if (user) {
        await this.onUserLoggedIn(user);
      } else {
        this.onUserLoggedOut();
      }
    });
  },

  /**
   * Cuando el usuario inicia sesión
   */
  async onUserLoggedIn(user) {
    console.log('Usuario autenticado:', user.email);

    // Verificar si es admin desde Firestore
    let isAdmin = false;
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        isAdmin = userData.role === 'admin';
      }
    } catch (error) {
      console.error('Error al obtener rol de usuario:', error);
    }

    // Guardar info del usuario
    this.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: isAdmin
    };

    // Actualizar UI
    this.updateUI(true);

    // Si estamos en dashboard y no es admin, redirigir
    if (window.location.pathname.includes('dashboard.html') && !isAdmin) {
      this.showError('No tienes permisos para acceder al dashboard');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  },

  /**
   * Cuando el usuario cierra sesión
   */
  onUserLoggedOut() {
    console.log('Usuario no autenticado');
    this.currentUser = null;
    this.updateUI(false);

    // Si estamos en dashboard, redirigir a index.html
    if (window.location.pathname.includes('dashboard.html')) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  },

  /**
   * Actualiza la UI según el estado de autenticación
   */
  updateUI(isLoggedIn) {
    const userSection = document.getElementById('userSection');
    const loginButton = document.getElementById('loginButton');
    const userEmail = document.getElementById('userEmail');
    const logoutButton = document.getElementById('logoutButton');

    if (!userSection) return;

    if (isLoggedIn && this.currentUser) {
      if (loginButton) loginButton.classList.add('hidden');
      if (userSection) userSection.classList.remove('hidden');
      if (userEmail) userEmail.textContent = this.currentUser.email;
    } else {
      if (loginButton) loginButton.classList.remove('hidden');
      if (userSection) userSection.classList.add('hidden');
    }
  },

  /**
   * Login con email y contraseña
   */
  async loginWithEmail(email, password) {
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },

  /**
   * Registro con email y contraseña
   */
  async registerWithEmail(email, password, displayName) {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Actualizar perfil con nombre
      if (displayName) {
        await result.user.updateProfile({
          displayName: displayName
        });
      }

      // Crear documento de usuario en Firestore
      await this.createUserDocument(result.user);

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },

  /**
   * Login con Google
   */
  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);

      // Crear documento de usuario si no existe
      await this.createUserDocument(result.user);

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error en login con Google:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      await firebase.auth().signOut();
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Recuperar contraseña
   */
  async resetPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },

  /**
   * Crear documento de usuario en Firestore
   */
  async createUserDocument(user) {
    try {
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          role: 'user' // Por defecto es usuario normal
        });
      }
    } catch (error) {
      console.error('Error al crear documento de usuario:', error);
    }
  },

  /**
   * Verificar si el usuario es admin
   */
  async isAdmin() {
    if (!this.currentUser) return false;

    try {
      const user = firebase.auth().currentUser;
      if (!user) return false;

      // Verificar en Firestore el campo role
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData.role === 'admin';
      }

      return false;
    } catch (error) {
      console.error('Error al verificar rol de admin:', error);
      return false;
    }
  },

  /**
   * Mostrar modal de login
   */
  showLoginModal() {
    // Verificar que Firebase esté configurado
    if (!window.firebase || !window.firebase.auth) {
      console.warn('Firebase no está configurado. Configure Firebase en js/config/firebase-config.js');
      return;
    }

    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('hidden');
      this.switchToLogin();
      // Asegurar que el modal sea visible
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Ocultar modal de login
   */
  hideLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('hidden');
      this.clearAuthForm();
      // Restaurar scroll del body
      document.body.style.overflow = '';
    }
  },

  /**
   * Cambiar a formulario de login
   */
  switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (loginForm) loginForm.classList.remove('hidden');
    if (registerForm) registerForm.classList.add('hidden');
    if (forgotPasswordForm) forgotPasswordForm.classList.add('hidden');
  },

  /**
   * Cambiar a formulario de registro
   */
  switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
    if (forgotPasswordForm) forgotPasswordForm.classList.add('hidden');
  },

  /**
   * Cambiar a formulario de recuperación
   */
  switchToForgotPassword() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.add('hidden');
    if (forgotPasswordForm) forgotPasswordForm.classList.remove('hidden');
  },

  /**
   * Limpiar formularios
   */
  clearAuthForm() {
    const forms = document.querySelectorAll('#authModal form');
    forms.forEach(form => form.reset());

    const errors = document.querySelectorAll('.auth-error');
    errors.forEach(error => error.textContent = '');
  },

  /**
   * Mostrar error en formulario
   */
  showFormError(formId, message) {
    const errorElement = document.getElementById(`${formId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  },

  /**
   * Mostrar error general
   */
  showError(message) {
    // Usar sistema de alertas existente si está disponible
    if (window.DashboardModule && window.DashboardModule.showAlert) {
      window.DashboardModule.showAlert(message, 'error');
    } else {
      alert(message);
    }
  },

  /**
   * Mostrar éxito
   */
  showSuccess(message) {
    if (window.DashboardModule && window.DashboardModule.showAlert) {
      window.DashboardModule.showAlert(message, 'success');
    } else {
      alert(message);
    }
  },

  /**
   * Traducir códigos de error de Firebase
   */
  getErrorMessage(errorCode) {
    const errors = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/popup-closed-by-user': 'Popup cerrado por el usuario',
      'auth/cancelled-popup-request': 'Popup cancelado',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión'
    };

    return errors[errorCode] || 'Error de autenticación. Intenta nuevamente.';
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que Firebase esté cargado
    setTimeout(() => AuthModule.init(), 500);
  });
} else {
  setTimeout(() => AuthModule.init(), 500);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.AuthModule = AuthModule;
}
