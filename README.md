# AutoPremium - Concesionaria de Autos

Sitio web de demostración para una concesionaria de autos de lujo con panel administrativo.

## Características

- Catálogo de vehículos con sistema de filtros
- Dashboard administrativo para gestión de inventario (CRUD completo)
- Diseño responsive (mobile-first)
- Almacenamiento en la nube (Firebase Firestore)
- Accesibilidad implementada (WCAG 2.1 nivel AA)
- Sin frameworks pesados (vanilla JavaScript + Firebase)

## Tecnologías Utilizadas

- HTML5 semántico
- CSS3 con variables personalizadas (design system)
- JavaScript vanilla (ES6+)
- Firebase Firestore para persistencia de datos

## Estructura del Proyecto

```
concesionaria/
├── index.html              # Página principal con catálogo
├── dashboard.html          # Panel administrativo
├── robots.txt             # Configuración SEO
├── css/
│   ├── design-system.css  # Variables y sistema de diseño
│   ├── global.css         # Reset y estilos base
│   ├── components.css     # Componentes reutilizables
│   └── sections/          # Estilos por sección
│       ├── navigation.css
│       ├── hero.css
│       ├── catalog.css
│       ├── dashboard.css
│       └── footer.css
├── js/
│   ├── main.js            # Inicialización y funcionalidad global
│   └── modules/
│       ├── storage.js     # Gestión de LocalStorage
│       ├── catalog.js     # Funcionalidad del catálogo
│       └── dashboard.js   # Funcionalidad del dashboard
└── images/                # Imágenes del sitio
```

## Funcionalidades

### Página Principal (index.html)
- Hero section con llamados a la acción
- Catálogo de vehículos con cards responsivas
- Filtros por marca, año y precio
- Navegación responsive

### Dashboard (dashboard.html)
- Agregar nuevos vehículos
- Editar vehículos existentes
- Eliminar vehículos (con confirmación)
- Validación de formularios
- Mensajes de feedback al usuario

## Datos de Demostración

El sitio incluye 6 vehículos de demostración que se cargan automáticamente en Firebase Firestore la primera vez que se accede (si la base de datos está vacía).

## Configuración de Firebase

**IMPORTANTE:** Este proyecto requiere una cuenta de Firebase para funcionar.

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz click en "Agregar proyecto"
3. Asigna un nombre al proyecto (ej: "autopremium-demo")
4. Sigue los pasos para crear el proyecto

### Paso 2: Habilitar Firestore Database

1. En el menú lateral, ve a "Compilación" > "Firestore Database"
2. Haz click en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Elige la ubicación del servidor (recomendado: la más cercana a tu región)
5. Haz click en "Habilitar"

### Paso 3: Configurar Reglas de Seguridad (Desarrollo)

En la pestaña "Reglas" de Firestore, reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read, write: if true;
    }
  }
}
```

**NOTA:** Estas reglas son para desarrollo. Para producción, implementa autenticación y reglas más restrictivas.

### Paso 4: Obtener Credenciales

1. En Firebase Console, ve a "Configuración del proyecto" (ícono de engranaje)
2. En la sección "Tus apps", selecciona "Web" (ícono </>)
3. Registra una app con un nombre (ej: "AutoPremium Web")
4. Copia la configuración de Firebase que aparece

### Paso 5: Configurar el Proyecto

1. Abre el archivo `js/config/firebase-config.js`
2. Reemplaza los valores de `firebaseConfig` con los de tu proyecto:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## Instalación y Uso

### Requisitos Previos
- Navegador web moderno
- Conexión a internet (para Firebase)
- Cuenta de Firebase configurada (ver sección anterior)

### Pasos de Instalación

1. Clonar el repositorio
2. Configurar Firebase (ver sección "Configuración de Firebase")
3. Abrir `index.html` en un navegador web moderno
4. El sitio cargará automáticamente 6 vehículos de demostración en la primera visita
5. Para acceder al dashboard, hacer click en "Administrar Inventario" o navegar a `dashboard.html`

### Servidor Local (Recomendado)

Para mejor experiencia, usa un servidor local:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (npx)
npx http-server

# Opción 3: VS Code Live Server
# Instala la extensión "Live Server" y haz click derecho en index.html
```

Luego abre `http://localhost:8000` en tu navegador.

## Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Navegadores móviles modernos

## Principios de Desarrollo

Este proyecto sigue las mejores prácticas de desarrollo web moderno:

- Mobile-first design
- HTML semántico
- Separación de responsabilidades (HTML/CSS/JS)
- Accesibilidad (navegación por teclado, ARIA, contraste)
- Performance optimizado
- Sin frameworks innecesarios (KISS principle)

## Accesibilidad

- Navegación completa por teclado
- ARIA labels y roles apropiados
- Contraste de color 4.5:1 mínimo
- Tamaños táctiles de 44x44px mínimo
- Skip link para navegación rápida
- Alt texts descriptivos en imágenes

## Mejoras Futuras

- Autenticación de usuarios (Firebase Auth)
- Reglas de seguridad de Firestore más restrictivas
- Subida de imágenes a Firebase Storage
- Sistema de búsqueda avanzada con Algolia
- Comparación de vehículos
- Sistema de favoritos por usuario
- Formulario de contacto funcional con Nodemailer
- Panel de analíticas y estadísticas
- Sistema de notificaciones en tiempo real
- Multi-idioma (i18n)

## Licencia

Proyecto de demostración - Libre uso educativo

## Autor

AutoPremium Demo - 2025
