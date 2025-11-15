# AutoPremium - Concesionaria de Autos

Sitio web de demostración para una concesionaria de autos de lujo con panel administrativo.

## Características

- Catálogo de vehículos con sistema de filtros
- Dashboard administrativo para gestión de inventario (CRUD completo)
- Diseño responsive (mobile-first)
- Almacenamiento local (LocalStorage)
- Accesibilidad implementada (WCAG 2.1 nivel AA)
- Sin dependencias externas (vanilla JavaScript)

## Tecnologías Utilizadas

- HTML5 semántico
- CSS3 con variables personalizadas (design system)
- JavaScript vanilla (ES6+)
- LocalStorage para persistencia de datos

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

El sitio incluye 6 vehículos de demostración que se cargan automáticamente la primera vez que se accede. Los datos persisten en LocalStorage del navegador.

## Instalación y Uso

1. Clonar el repositorio
2. Abrir `index.html` en un navegador web moderno
3. Para acceder al dashboard, hacer click en "Administrar Inventario" o navegar a `dashboard.html`

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

- Backend real (Node.js/Express, etc.)
- Base de datos (PostgreSQL, MongoDB)
- Autenticación de usuarios
- Subida de imágenes real
- Sistema de búsqueda avanzada
- Comparación de vehículos
- Sistema de favoritos
- Formulario de contacto funcional

## Licencia

Proyecto de demostración - Libre uso educativo

## Autor

AutoPremium Demo - 2025
