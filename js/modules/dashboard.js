/* ========================================
   DASHBOARD MODULE - Gestión de autos
   ======================================== */

const DashboardModule = {
  currentEditId: null,
  deleteCarId: null,

  /**
   * Inicializa el módulo de dashboard
   */
  init() {
    // Solo ejecutar si estamos en la página de dashboard
    if (!document.getElementById('carForm')) {
      return;
    }

    this.setupEventListeners();
    this.loadCars();
  },

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    // Botón mostrar formulario
    const btnShowForm = document.getElementById('btnShowForm');
    if (btnShowForm) {
      btnShowForm.addEventListener('click', () => this.showForm());
    }

    // Botón cancelar formulario
    const btnCancelForm = document.getElementById('btnCancelForm');
    if (btnCancelForm) {
      btnCancelForm.addEventListener('click', () => this.hideForm());
    }

    // Formulario de auto
    const carForm = document.getElementById('carForm');
    if (carForm) {
      carForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Modal de eliminación
    const modalClose = document.getElementById('modalClose');
    const btnCancelDelete = document.getElementById('btnCancelDelete');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');

    if (modalClose) {
      modalClose.addEventListener('click', () => this.hideDeleteModal());
    }
    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', () => this.hideDeleteModal());
    }
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', () => this.confirmDelete());
    }

    // Cerrar modal al hacer click fuera
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
          this.hideDeleteModal();
        }
      });
    }
  },

  /**
   * Muestra el formulario de agregar/editar
   */
  showForm() {
    const formContainer = document.getElementById('carFormContainer');
    const formTitle = document.getElementById('formTitle');
    const btnSubmitText = document.getElementById('btnSubmitText');

    if (formContainer) {
      formContainer.classList.remove('hidden');
      if (formTitle) {
        formTitle.textContent = this.currentEditId ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo';
      }
      if (btnSubmitText) {
        btnSubmitText.textContent = this.currentEditId ? 'Actualizar Vehículo' : 'Guardar Vehículo';
      }
      // Scroll al formulario
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Oculta el formulario
   */
  hideForm() {
    const formContainer = document.getElementById('carFormContainer');
    const carForm = document.getElementById('carForm');

    if (formContainer) {
      formContainer.classList.add('hidden');
    }
    if (carForm) {
      carForm.reset();
      this.clearErrors();
    }
    this.currentEditId = null;
  },

  /**
   * Maneja el envío del formulario
   */
  handleSubmit(e) {
    e.preventDefault();

    // Limpiar errores previos
    this.clearErrors();

    // Obtener datos del formulario
    const formData = this.getFormData();

    // Validar
    const errors = this.validateFormData(formData);
    if (Object.keys(errors).length > 0) {
      this.showErrors(errors);
      return;
    }

    try {
      if (this.currentEditId) {
        // Actualizar
        CarStorage.update(this.currentEditId, formData);
        this.showAlert('Vehículo actualizado exitosamente', 'success');
      } else {
        // Crear nuevo
        CarStorage.save(formData);
        this.showAlert('Vehículo agregado exitosamente', 'success');
      }

      this.hideForm();
      this.loadCars();
    } catch (error) {
      this.showAlert('Error al guardar el vehículo: ' + error.message, 'error');
    }
  },

  /**
   * Obtiene los datos del formulario
   */
  getFormData() {
    return {
      brand: document.getElementById('brand')?.value.trim() || '',
      model: document.getElementById('model')?.value.trim() || '',
      year: parseInt(document.getElementById('year')?.value) || 0,
      price: parseFloat(document.getElementById('price')?.value) || 0,
      mileage: parseInt(document.getElementById('mileage')?.value) || 0,
      transmission: document.getElementById('transmission')?.value || '',
      fuelType: document.getElementById('fuelType')?.value || '',
      color: document.getElementById('color')?.value.trim() || '',
      imageUrl: document.getElementById('imageUrl')?.value.trim() || '',
      description: document.getElementById('description')?.value.trim() || ''
    };
  },

  /**
   * Valida los datos del formulario
   */
  validateFormData(data) {
    const errors = {};

    if (!data.brand) {
      errors.brand = 'La marca es requerida';
    }

    if (!data.model) {
      errors.model = 'El modelo es requerido';
    }

    if (!data.year || data.year < 1900 || data.year > 2025) {
      errors.year = 'Año inválido (1900-2025)';
    }

    if (!data.price || data.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    }

    if (!data.mileage || data.mileage < 0) {
      errors.mileage = 'El kilometraje debe ser 0 o mayor';
    }

    if (!data.transmission) {
      errors.transmission = 'La transmisión es requerida';
    }

    if (!data.fuelType) {
      errors.fuelType = 'El tipo de combustible es requerido';
    }

    if (data.imageUrl && !this.isValidUrl(data.imageUrl)) {
      errors.imageUrl = 'La URL de imagen no es válida';
    }

    return errors;
  },

  /**
   * Valida si una URL es válida
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Muestra errores en el formulario
   */
  showErrors(errors) {
    Object.keys(errors).forEach(field => {
      const input = document.getElementById(field);
      const errorSpan = document.getElementById(`${field}Error`);

      if (input) {
        input.classList.add('error');
      }
      if (errorSpan) {
        errorSpan.textContent = errors[field];
      }
    });
  },

  /**
   * Limpia los errores del formulario
   */
  clearErrors() {
    const inputs = document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error');
    inputs.forEach(input => input.classList.remove('error'));

    const errorSpans = document.querySelectorAll('.form-error');
    errorSpans.forEach(span => span.textContent = '');
  },

  /**
   * Carga y renderiza todos los autos
   */
  loadCars() {
    const carsList = document.getElementById('carsList');
    const carsEmpty = document.getElementById('carsEmpty');

    if (!carsList || !carsEmpty) return;

    const cars = CarStorage.getAll();

    if (cars.length === 0) {
      carsList.innerHTML = '';
      carsEmpty.classList.remove('hidden');
      return;
    }

    carsEmpty.classList.add('hidden');
    carsList.innerHTML = cars.map(car => this.createCarListItem(car)).join('');

    // Agregar event listeners a los botones
    this.attachCarActions();
  },

  /**
   * Crea el HTML de un item de auto en la lista
   */
  createCarListItem(car) {
    const formattedPrice = this.formatPrice(car.price);

    return `
      <div class="dashboard-car-item">
        <div class="dashboard-car-info">
          <div class="dashboard-car-main">
            <div class="dashboard-car-name">
              ${this.escapeHtml(car.brand)} ${this.escapeHtml(car.model)} ${car.year}
            </div>
            <div class="dashboard-car-details">
              ${this.formatNumber(car.mileage)} km • ${this.escapeHtml(car.transmission)} • ${this.escapeHtml(car.fuelType)}
              ${car.color ? ` • ${this.escapeHtml(car.color)}` : ''}
            </div>
          </div>
          <div class="dashboard-car-price">${formattedPrice}</div>
        </div>
        <div class="dashboard-car-actions">
          <button class="btn btn-sm btn-secondary" data-action="edit" data-id="${car.id}" aria-label="Editar ${car.brand} ${car.model}">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete" data-id="${car.id}" aria-label="Eliminar ${car.brand} ${car.model}">
            Eliminar
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Adjunta event listeners a los botones de acción
   */
  attachCarActions() {
    const editButtons = document.querySelectorAll('[data-action="edit"]');
    const deleteButtons = document.querySelectorAll('[data-action="delete"]');

    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.editCar(id);
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.showDeleteModal(id);
      });
    });
  },

  /**
   * Edita un auto
   */
  editCar(id) {
    const car = CarStorage.getById(id);
    if (!car) {
      this.showAlert('Vehículo no encontrado', 'error');
      return;
    }

    this.currentEditId = id;

    // Llenar el formulario
    document.getElementById('brand').value = car.brand;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('price').value = car.price;
    document.getElementById('mileage').value = car.mileage;
    document.getElementById('transmission').value = car.transmission;
    document.getElementById('fuelType').value = car.fuelType;
    document.getElementById('color').value = car.color || '';
    document.getElementById('imageUrl').value = car.imageUrl || '';
    document.getElementById('description').value = car.description || '';

    this.showForm();
  },

  /**
   * Muestra el modal de confirmación de eliminación
   */
  showDeleteModal(id) {
    this.deleteCarId = id;
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.remove('hidden');
      // Enfocar el botón de cancelar para accesibilidad
      setTimeout(() => {
        document.getElementById('btnCancelDelete')?.focus();
      }, 100);
    }
  },

  /**
   * Oculta el modal de eliminación
   */
  hideDeleteModal() {
    this.deleteCarId = null;
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  /**
   * Confirma y ejecuta la eliminación
   */
  confirmDelete() {
    if (!this.deleteCarId) return;

    try {
      const deleted = CarStorage.delete(this.deleteCarId);
      if (deleted) {
        this.showAlert('Vehículo eliminado exitosamente', 'success');
        this.loadCars();
      } else {
        this.showAlert('Vehículo no encontrado', 'error');
      }
    } catch (error) {
      this.showAlert('Error al eliminar el vehículo: ' + error.message, 'error');
    }

    this.hideDeleteModal();
  },

  /**
   * Muestra un mensaje de alerta
   */
  showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.classList.remove('hidden');

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      container.classList.add('hidden');
    }, 5000);
  },

  /**
   * Formatea un precio a formato USD
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
   */
  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  },

  /**
   * Escapa HTML para prevenir XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DashboardModule.init());
} else {
  DashboardModule.init();
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.DashboardModule = DashboardModule;
}
