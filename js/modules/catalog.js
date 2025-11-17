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
    this.setupModalListeners();
    this.loadCars();
    this.populateFilters();
  },

  /**
   * Configura los event listeners del modal
   */
  setupModalListeners() {
    const modal = document.getElementById('vehicleModal');
    const closeBtn = document.getElementById('closeVehicleModal');

    // Cerrar modal con el botón X
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeVehicleModal();
      });
    }

    // Cerrar modal al hacer click fuera del contenido
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeVehicleModal();
        }
      });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeVehicleModal();
      }
    });
  },

  /**
   * Configura los event listeners de los filtros
   */
  setupFilterListeners() {
    const filterBrand = document.getElementById('filterBrand');
    const filterYear = document.getElementById('filterYear');
    const filterPrice = document.getElementById('filterPrice');

    if (filterBrand) {
      filterBrand.addEventListener('change', async (e) => {
        this.currentFilters.brand = e.target.value;
        await this.loadCars();
      });
    }

    if (filterYear) {
      filterYear.addEventListener('change', async (e) => {
        this.currentFilters.year = e.target.value;
        await this.loadCars();
      });
    }

    if (filterPrice) {
      filterPrice.addEventListener('change', async (e) => {
        this.currentFilters.maxPrice = e.target.value;
        await this.loadCars();
      });
    }
  },

  /**
   * Puebla los filtros con datos disponibles
   */
  async populateFilters() {
    await this.populateBrands();
    await this.populateYears();
  },

  /**
   * Puebla el filtro de marcas
   */
  async populateBrands() {
    const filterBrand = document.getElementById('filterBrand');
    if (!filterBrand) return;

    try {
      const brands = await CarStorage.getBrands();
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
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    }
  },

  /**
   * Puebla el filtro de años
   */
  async populateYears() {
    const filterYear = document.getElementById('filterYear');
    if (!filterYear) return;

    try {
      const years = await CarStorage.getYears();
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
    } catch (error) {
      console.error('Error al cargar años:', error);
    }
  },

  /**
   * Carga y renderiza los autos según filtros
   */
  async loadCars() {
    const catalogGrid = document.getElementById('catalogGrid');
    const catalogEmpty = document.getElementById('catalogEmpty');

    if (!catalogGrid || !catalogEmpty) return;

    try {
      // Obtener autos filtrados
      const cars = await CarStorage.filter(this.currentFilters);

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

      // Agregar event listeners a los botones de contactar
      this.attachCardEventListeners(cars);
    } catch (error) {
      console.error('Error al cargar autos:', error);
      catalogGrid.classList.add('hidden');
      catalogEmpty.classList.remove('hidden');
    }
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
      <article class="card car-card" data-car-id="${car.id}">
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
            <button class="btn btn-primary view-details-btn" data-car-id="${car.id}" aria-label="Ver detalles de ${car.brand} ${car.model}">
              Ver Detalles
            </button>
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Agrega event listeners a las cards de autos
   * @param {Array} cars - Array de autos
   */
  attachCardEventListeners(cars) {
    const buttons = document.querySelectorAll('.view-details-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const carId = e.target.dataset.carId;
        const car = cars.find(c => c.id === carId);
        if (car) {
          this.showVehicleModal(car);
        }
      });
    });
  },

  /**
   * Muestra el modal con los detalles del vehículo
   * @param {Object} car - Datos del auto
   */
  showVehicleModal(car) {
    const modal = document.getElementById('vehicleModal');
    const modalBody = document.getElementById('vehicleModalBody');

    if (!modal || !modalBody) return;

    const imageUrl = car.imageUrl || 'https://via.placeholder.com/800x600?text=Sin+Imagen';
    const formattedPrice = this.formatPrice(car.price);

    modalBody.innerHTML = `
      <img
        src="${imageUrl}"
        alt="${car.brand} ${car.model} ${car.year}"
        class="vehicle-modal-image"
      >

      <div class="vehicle-modal-header">
        <div class="vehicle-modal-brand">${this.escapeHtml(car.brand)}</div>
        <h3 class="vehicle-modal-model">${this.escapeHtml(car.model)}</h3>
        <div class="vehicle-modal-year">${car.year}</div>
      </div>

      <div class="vehicle-modal-price">${formattedPrice}</div>

      <div class="vehicle-modal-specs">
        <div class="vehicle-modal-spec">
          <span class="vehicle-modal-spec-label">Kilometraje</span>
          <span class="vehicle-modal-spec-value">${this.formatNumber(car.mileage)} km</span>
        </div>
        <div class="vehicle-modal-spec">
          <span class="vehicle-modal-spec-label">Transmisión</span>
          <span class="vehicle-modal-spec-value">${this.escapeHtml(car.transmission)}</span>
        </div>
        <div class="vehicle-modal-spec">
          <span class="vehicle-modal-spec-label">Combustible</span>
          <span class="vehicle-modal-spec-value">${this.escapeHtml(car.fuelType)}</span>
        </div>
        ${car.color ? `
          <div class="vehicle-modal-spec">
            <span class="vehicle-modal-spec-label">Color</span>
            <span class="vehicle-modal-spec-value">${this.escapeHtml(car.color)}</span>
          </div>
        ` : ''}
      </div>

      ${car.description ? `
        <div class="vehicle-modal-description">
          <h4 class="vehicle-modal-description-title">Descripción</h4>
          <p class="vehicle-modal-description-text">${this.escapeHtml(car.description)}</p>
        </div>
      ` : ''}

      <div class="vehicle-modal-actions">
        <button class="btn btn-outline" onclick="CatalogModule.closeVehicleModal()">
          Cerrar
        </button>
        <button class="btn btn-primary" onclick="CatalogModule.contactAboutVehicle('${car.id}')">
          Contactar
        </button>
      </div>
    `;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  },

  /**
   * Cierra el modal de vehículo
   */
  closeVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  },

  /**
   * Acción de contactar sobre un vehículo
   * @param {string} carId - ID del auto
   */
  contactAboutVehicle(carId) {
    // Por ahora solo mostrar un mensaje
    // Aquí se puede implementar un formulario de contacto o WhatsApp
    alert(`Funcionalidad de contacto para vehículo ID: ${carId}\n\nEsta funcionalidad se puede conectar a:\n- Formulario de contacto\n- WhatsApp Business\n- Email\n- Sistema de reservas`);
    this.closeVehicleModal();
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
