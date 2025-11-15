/* ========================================
   MAIN - Inicialización y funcionalidad global
   ======================================== */

const App = {
  /**
   * Inicializa la aplicación
   */
  async init() {
    try {
      // Inicializar datos de demostración
      await CarStorage.initDemoData();

      // Configurar navegación móvil
      this.setupMobileNav();

      // Configurar smooth scroll
      this.setupSmoothScroll();

      console.log('AutoPremium inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  },

  /**
   * Configura el menú de navegación móvil
   */
  setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');

      // Actualizar aria-expanded para accesibilidad
      navToggle.setAttribute('aria-expanded', isActive.toString());

      // Cambiar texto del aria-label
      navToggle.setAttribute(
        'aria-label',
        isActive ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
    });

    // Cerrar menú al hacer click en un link (móvil)
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        }
      });
    });

    // Cerrar menú al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  },

  /**
   * Configura smooth scroll para enlaces internos
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignorar el skip link y links vacíos
        if (href === '#' || href === '#main-content') {
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Actualizar URL sin scroll
          history.pushState(null, '', href);
        }
      });
    });
  },

  /**
   * Detecta si es dispositivo táctil
   */
  detectTouch() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    }
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.detectTouch();
  });
} else {
  App.init();
  App.detectTouch();
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.App = App;
}
