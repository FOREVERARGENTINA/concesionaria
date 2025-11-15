/* ========================================
   CATALOG MODULE - Catálogo de autos
   ======================================== */

const CatalogModule = {
  currentFilters: {
    brand: '',
    year: '',
    maxPrice: ''
  },

  /**
   * Inicializa el módulo de catálogo
   */
  init() {
    // Solo ejecutar si estamos en la página principal
    if (!document.getElementById('catalogGrid')) {
      return;
    }

    this.setupFilterListeners();
    this.loadCars();
    this.populateFilters();
  },

  /**
   * Configura los event listeners de los filtros
   */
  setupFilterListeners() {
    const filterBrand = document.getElementById('filterBrand');
    const filterYear = document.getElementById('filterYear');
    const filterPrice = document.getElementById('filterPrice');

    if (filterBrand) {
      filterBrand.addEventListener('change', (e) => {
        this.currentFilters.brand = e.target.value;
        this.loadCars();
      });
    }

    if (filterYear) {
      filterYear.addEventListener('change', (e) => {
        this.currentFilters.year = e.target.value;
        this.loadCars();
      });
    }

    if (filterPrice) {
      filterPrice.addEventListener('change', (e) => {
        this.currentFilters.maxPrice = e.target.value;
        this.loadCars();
      });
    }
  },

  /**
   * Puebla los filtros con datos disponibles
   */
  populateFilters() {
    this.populateBrands();
    this.populateYears();
  },

  /**
   * Puebla el filtro de marcas
   */
  populateBrands() {
    const filterBrand = document.getElementById('filterBrand');
    if (!filterBrand) return;

    const brands = CarStorage.getBrands();
    const currentValue = filterBrand.value;

    // Limpiar opciones existentes excepto la primera
    filterBrand.innerHTML = '<option value="">Todas las marcas</option>';

    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      filterBrand.appendChild(option);
    });

    // Restaurar el valor seleccionado
    filterBrand.value = currentValue;
  },

  /**
   * Puebla el filtro de años
   */
  populateYears() {
    const filterYear = document.getElementById('filterYear');
    if (!filterYear) return;

    const years = CarStorage.getYears();
    const currentValue = filterYear.value;

    // Limpiar opciones existentes excepto la primera
    filterYear.innerHTML = '<option value="">Todos los años</option>';

    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      filterYear.appendChild(option);
    });

    // Restaurar el valor seleccionado
    filterYear.value = currentValue;
  },

  /**
   * Carga y renderiza los autos según filtros
   */
  loadCars() {
    const catalogGrid = document.getElementById('catalogGrid');
    const catalogEmpty = document.getElementById('catalogEmpty');

    if (!catalogGrid || !catalogEmpty) return;

    // Obtener autos filtrados
    const cars = CarStorage.filter(this.currentFilters);

    // Mostrar/ocultar estado vacío
    if (cars.length === 0) {
      catalogGrid.classList.add('hidden');
      catalogEmpty.classList.remove('hidden');
      return;
    }

    catalogGrid.classList.remove('hidden');
    catalogEmpty.classList.add('hidden');

    // Renderizar autos
    catalogGrid.innerHTML = cars.map(car => this.createCarCard(car)).join('');
  },

  /**
   * Crea el HTML de una card de auto
   * @param {Object} car - Datos del auto
   * @returns {string} HTML de la card
   */
  createCarCard(car) {
    const imageUrl = car.imageUrl || 'https://via.placeholder.com/800x600?text=Sin+Imagen';
    const formattedPrice = this.formatPrice(car.price);

    return `
      <article class="card car-card">
        <img
          src="${imageUrl}"
          alt="${car.brand} ${car.model} ${car.year}"
          class="card-image"
          loading="lazy"
        >
        <div class="card-body">
          <span class="car-brand">${this.escapeHtml(car.brand)}</span>
          <h3 class="car-model">${this.escapeHtml(car.model)}</h3>
          <p class="car-year">${car.year}</p>

          <div class="car-features">
            <span class="car-feature" title="Kilometraje">
              <span aria-label="Kilometraje">${this.formatNumber(car.mileage)} km</span>
            </span>
            <span class="car-feature" title="Transmisión">
              <span aria-label="Transmisión">${this.escapeHtml(car.transmission)}</span>
            </span>
            <span class="car-feature" title="Combustible">
              <span aria-label="Combustible">${this.escapeHtml(car.fuelType)}</span>
            </span>
            ${car.color ? `
              <span class="car-feature" title="Color">
                <span aria-label="Color">${this.escapeHtml(car.color)}</span>
              </span>
            ` : ''}
          </div>

          ${car.description ? `
            <p class="card-text">${this.escapeHtml(car.description)}</p>
          ` : ''}

          <div class="car-price">${formattedPrice}</div>

          <div class="car-actions">
            <button class="btn btn-primary" aria-label="Contactar sobre ${car.brand} ${car.model}">
              Contactar
            </button>
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Formatea un precio a formato USD
   * @param {number} price - Precio
   * @returns {string} Precio formateado
   */
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  },

  /**
   * Formatea un número con separadores de miles
   * @param {number} num - Número
   * @returns {string} Número formateado
   */
  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  },

  /**
   * Escapa HTML para prevenir XSS
   * @param {string} text - Texto a escapar
   * @returns {string} Texto escapado
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CatalogModule.init());
} else {
  CatalogModule.init();
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.CatalogModule = CatalogModule;
}
