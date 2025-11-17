# Plan de Implementación - AutoPremium Concesionaria

## Fase 1: Fundamentos de Seguridad y Autenticación (CRÍTICO - 5-7 días)

### 1.1 Firebase Authentication
- [ ] Implementar login/registro con email/password
- [ ] Agregar Google Sign-In
- [ ] Crear modal moderno de autenticación
- [ ] Implementar recuperación de contraseña
- [ ] Página de perfil de usuario (avatar, datos, favoritos)

### 1.2 Sistema de Roles y Protección
- [ ] Implementar roles (admin/cliente) en Firestore claims
- [ ] Proteger dashboard.html: solo admins acceden
- [ ] Mostrar usuario actual, rol y botón "Salir"
- [ ] Redirección automática si no autenticado

### 1.3 Reglas de Seguridad Firestore
- [ ] Reglas restrictivas: solo admins escriben en colección `cars`
- [ ] Validación a nivel de reglas (price > 0, year válido)
- [ ] Proteger colección de usuarios y favoritos

### 1.4 Firebase Storage Setup
- [ ] Configurar Storage para imágenes
- [ ] Reglas de seguridad: solo admins suben a /cars/
- [ ] Restricción por mimetype (images/*) y tamaño (5MB)

**Archivos a crear/modificar:**
- `js/modules/auth.js` (nuevo)
- `js/config/firebase-config.js` (actualizar - agregar Auth SDK)
- `index.html` y `dashboard.html` (agregar Auth SDK)
- Firestore Rules (en Firebase Console)
- Storage Rules (en Firebase Console)

---

## Fase 2: Gestión de Imágenes (ALTA - 4-6 días)

### 2.1 Upload de Imágenes en Dashboard
- [ ] UI de drag & drop para subir imágenes
- [ ] Preview antes de guardar
- [ ] Progress bar de upload
- [ ] Soporte para múltiples imágenes (5-10 por auto)
- [ ] Compresión automática antes de subir

### 2.2 Galería de Imágenes
- [ ] Galería de imágenes en cards del catálogo
- [ ] Lightbox/modal para ver imágenes en grande
- [ ] Carousel con thumbnails
- [ ] Imagen principal + galería secundaria
- [ ] Lazy loading de imágenes

### 2.3 Optimización de Imágenes
- [ ] Generar thumbnails (small/medium/large)
- [ ] Convertir a WebP con fallback
- [ ] Implementar srcset para responsive
- [ ] Técnica blur-up (baja → alta resolución)

**Archivos a crear/modificar:**
- `js/modules/imageUpload.js` (nuevo)
- `js/modules/gallery.js` (nuevo)
- `js/modules/dashboard.js` (actualizar)
- `css/sections/gallery.css` (nuevo)
- `dashboard.html` (agregar UI de upload)

---

## Fase 3: Optimización Firestore y Performance (ALTA - 3-5 días)

### 3.1 Queries Optimizadas
- [ ] Eliminar filtros en memoria (usar queries Firestore)
- [ ] Crear índices compuestos necesarios
- [ ] Implementar paginación (10-20 items por página)
- [ ] Lazy loading / infinite scroll

### 3.2 Migración SDK Modular
- [ ] Migrar de firebase-compat a SDK modular v9
- [ ] Tree-shaking para reducir bundle size
- [ ] Code splitting por módulo

### 3.3 Build Process
- [ ] Configurar Vite como bundler
- [ ] Minificación de JS/CSS
- [ ] PurgeCSS para CSS no utilizado
- [ ] Scripts: dev, build, preview

**Archivos a crear/modificar:**
- `package.json` (nuevo)
- `vite.config.js` (nuevo)
- `js/modules/storage.js` (actualizar - queries optimizadas)
- `js/modules/pagination.js` (nuevo)
- Todos los archivos JS (migrar a SDK modular)

---

## Fase 4: Rediseño Visual Hero y Catálogo (ALTA - 5-7 días)

### 4.1 Hero Section Premium
- [ ] Imagen de fondo de alta calidad (Unsplash)
- [ ] Overlay oscuro con gradiente
- [ ] Animación fade-in + slide-up
- [ ] Efecto parallax ligero en background
- [ ] Scroll indicator animado
- [ ] CTA destacados con hover effect

### 4.2 Cards del Catálogo Mejoradas
- [ ] Hover effect: elevación + escala de imagen
- [ ] Skeleton loaders mientras cargan
- [ ] Animación de entrada escalonada (reveal on scroll)
- [ ] Badges ("Nuevo", "Destacado")
- [ ] Layout consistente de imagen/info/precio
- [ ] Vista grid/lista toggle

### 4.3 Página de Detalle del Vehículo
- [ ] Galería principal con carousel
- [ ] Specs completas en tabla
- [ ] CTA de "Contactar" y "Test Drive"
- [ ] Calculadora de financiamiento
- [ ] Vehículos relacionados

### 4.4 Tipografía y Colores Premium
- [ ] Google Fonts premium (Playfair Display + Montserrat)
- [ ] Paleta: Dorado/Negro/Blanco para sensación de lujo
- [ ] Gradientes mesh sutiles
- [ ] Dark mode toggle (opcional)

**Archivos a crear/modificar:**
- `css/sections/hero.css` (actualizar)
- `css/sections/catalog.css` (actualizar)
- `css/sections/vehicle-detail.css` (nuevo)
- `css/animations.css` (nuevo)
- `vehicle-detail.html` (nuevo)
- `index.html` (actualizar hero)
- `js/modules/animations.js` (nuevo)

---

## Fase 5: Funcionalidades UX Avanzadas (MEDIA - 4-6 días)

### 5.1 Sistema de Filtros Mejorado
- [ ] Búsqueda por texto con autocomplete
- [ ] Range slider para precio
- [ ] Multi-select para características
- [ ] Filtros en URL (query params compartibles)
- [ ] Contador de resultados

### 5.2 Comparador de Vehículos
- [ ] Checkbox en cards para marcar (máx 3)
- [ ] Vista de comparación lado a lado
- [ ] Tabla de especificaciones comparativas

### 5.3 Sistema de Favoritos/Wishlist
- [ ] Botón de corazón en cada card
- [ ] Colección Firestore por usuario
- [ ] Página de favoritos
- [ ] Link compartible de wishlist

### 5.4 Dashboard Admin Mejorado
- [ ] Estadísticas visuales (Chart.js)
- [ ] Tabla con sorting y búsqueda
- [ ] Acciones en bulk (seleccionar múltiples)
- [ ] Exportar a CSV
- [ ] Historial de cambios (log)

**Archivos a crear/modificar:**
- `js/modules/filters.js` (actualizar)
- `js/modules/comparator.js` (nuevo)
- `js/modules/wishlist.js` (nuevo)
- `js/modules/analytics.js` (nuevo)
- `compare.html` (nuevo)
- `wishlist.html` (nuevo)
- `css/sections/compare.css` (nuevo)

---

## Fase 6: Animaciones y Efectos (MEDIA - 3-4 días)

### 6.1 Scroll Effects
- [ ] Reveal on scroll (elementos aparecen al entrar en viewport)
- [ ] Progress bar de lectura en top
- [ ] Sticky header con reducción de tamaño
- [ ] Parallax en múltiples capas (hero + secciones)

### 6.2 Micro-interacciones
- [ ] Ripple effect en botones
- [ ] Iconos animados al hover
- [ ] Transiciones suaves entre páginas
- [ ] Toast notifications elegantes
- [ ] Loading states con spinners modernos

### 6.3 Secciones Adicionales
- [ ] "Por qué elegirnos" con iconos animados
- [ ] Testimonios en carousel
- [ ] Estadísticas animadas (contadores)
- [ ] Logo slider de marcas
- [ ] Newsletter signup

**Archivos a crear/modificar:**
- `js/modules/animations.js` (actualizar)
- `js/modules/scroll-effects.js` (nuevo)
- `css/animations.css` (actualizar)
- `css/sections/testimonials.css` (nuevo)
- `css/sections/features.css` (nuevo)
- `index.html` (agregar nuevas secciones)

---

## Fase 7: SEO y Accesibilidad (MEDIA - 2-3 días)

### 7.1 SEO Avanzado
- [ ] Meta tags dinámicos por vehículo
- [ ] JSON-LD structured data (Product schema)
- [ ] Sitemap.xml dinámico (generado desde Firestore)
- [ ] Open Graph images dinámicas
- [ ] Canonical URLs

### 7.2 Accesibilidad (A11y)
- [ ] Verificar contraste 4.5:1 en todos los colores
- [ ] ARIA attributes en modales (role=dialog, focus trap)
- [ ] Navegación completa por teclado
- [ ] Mensajes de validación con aria-live
- [ ] Skip links mejorados

**Archivos a crear/modificar:**
- `js/modules/seo.js` (nuevo)
- `sitemap.xml` (generar dinámicamente)
- Todos los HTML (actualizar meta tags)
- Todos los CSS (verificar contraste)
- `js/modules/accessibility.js` (nuevo)

---

## Fase 8: Performance y PWA (MEDIA - 2-3 días)

### 8.1 Optimizaciones de Carga
- [ ] Lazy loading mejorado (IntersectionObserver)
- [ ] Preload de recursos críticos
- [ ] Defer scripts no críticos
- [ ] CDN para assets (Firebase Hosting)
- [ ] Compresión brotli/gzip

### 8.2 PWA Básico (Opcional)
- [ ] Service Worker con Workbox
- [ ] Manifest.json
- [ ] Ícono instalable
- [ ] Cache offline de assets estáticos

**Archivos a crear/modificar:**
- `service-worker.js` (nuevo)
- `manifest.json` (nuevo)
- `workbox-config.js` (nuevo)
- Todos los HTML (agregar preload/prefetch)

---

## Fase 9: Testing y CI/CD (MEDIA - 3-4 días)

### 9.1 Tests Automatizados
- [ ] Unit tests (CarStorage, modules) con Vitest
- [ ] E2E tests con Cypress (login + CRUD + upload)
- [ ] Test de accesibilidad automatizado

### 9.2 CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Lint + tests en cada PR
- [ ] Build y deploy a Firebase Hosting
- [ ] Environments (staging/production)

### 9.3 Documentación
- [ ] README completo con setup
- [ ] .env.example con variables
- [ ] Guía de contribución
- [ ] JSDoc en funciones principales

**Archivos a crear/modificar:**
- `tests/` (directorio nuevo con todos los tests)
- `.github/workflows/ci.yml` (nuevo)
- `.env.example` (nuevo)
- `CONTRIBUTING.md` (nuevo)
- `README.md` (actualizar)

---

## Fase 10: Extras y Mejoras (BAJA - según tiempo)

### 10.1 Integraciones
- [ ] WhatsApp CTA (botón flotante)
- [ ] Google Maps en ubicación
- [ ] Google Analytics / Firebase Analytics
- [ ] Chatbot básico (opcional)

### 10.2 Features Premium
- [ ] Tour virtual 360° (Matterport)
- [ ] Realidad aumentada AR.js (experimental)
- [ ] Sistema de reserva de test drive
- [ ] Email notifications
- [ ] Certificados de inspección PDF

### 10.3 Internacionalización
- [ ] Soporte multi-idioma (es/en)
- [ ] Cambio de moneda
- [ ] Dark mode completo

**Archivos a crear/modificar:**
- `js/modules/integrations.js` (nuevo)
- `js/modules/i18n.js` (nuevo)
- `locales/` (directorio nuevo)
- `css/themes/dark.css` (nuevo)

---

## MVP Recomendado (Lanzamiento Demo - 2-3 semanas)

### Incluir:
1. ✅ Firebase Auth + protección dashboard
2. ✅ Upload imágenes a Storage + galería
3. ✅ Reglas de seguridad Firestore/Storage
4. ✅ Hero rediseñado con parallax
5. ✅ Cards mejoradas con animaciones
6. ✅ Página de detalle del vehículo
7. ✅ Filtros mejorados
8. ✅ Optimización de imágenes (WebP)
9. ✅ SEO básico (meta tags + schema)
10. ✅ Build process (Vite)

### Postponer para v2:
- PWA completo
- Tests E2E exhaustivos
- Features premium (AR, 360°)
- Multi-idioma
- Analytics avanzado

---

## Estimación Total

**Fases Críticas (MVP):** 15-20 días
**Fases Opcionales:** 10-15 días adicionales
**Total con todos los extras:** 25-35 días

---

## Notas Técnicas Importantes

1. **Imágenes de Unsplash:** Usar API de Unsplash para imágenes de demo (respetar atribución)
2. **Firebase Config:** Mantener credenciales fuera del repo (usar .env)
3. **Parallax:** Usar `transform` + `will-change` + `requestAnimationFrame` (no heavy parallax)
4. **Accesibilidad:** Siempre aria-* y focus management
5. **Queries:** Firestore requiere índices para queries compuestas - crearlos según necesidad

---

## Progreso Actual

### Completado ✅
- Estructura base del proyecto
- Sistema de diseño CSS modular
- Firebase Firestore integrado
- CRUD básico de vehículos
- Catálogo con filtros básicos
- Dashboard administrativo
- Responsive mobile-first

### Siguiente Paso 🎯
- **Comenzar Fase 1:** Autenticación y Seguridad

---

## Checklist por Fase

Se irá actualizando este documento marcando `[x]` en cada tarea completada.

**Última actualización:** 2025-01-17
