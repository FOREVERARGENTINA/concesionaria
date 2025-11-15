/* ========================================
   STORAGE MODULE - LocalStorage Management
   ======================================== */

const CarStorage = {
  STORAGE_KEY: 'autopremium_cars',

  /**
   * Obtiene todos los autos del LocalStorage
   * @returns {Array} Array de objetos de autos
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer del localStorage:', error);
      return [];
    }
  },

  /**
   * Obtiene un auto por ID
   * @param {string} id - ID del auto
   * @returns {Object|null} Objeto del auto o null si no existe
   */
  getById(id) {
    const cars = this.getAll();
    return cars.find(car => car.id === id) || null;
  },

  /**
   * Guarda un nuevo auto
   * @param {Object} carData - Datos del auto
   * @returns {Object} Auto guardado con ID
   */
  save(carData) {
    try {
      const cars = this.getAll();
      const newCar = {
        ...carData,
        id: this.generateId(),
        createdAt: new Date().toISOString()
      };
      cars.push(newCar);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cars));
      return newCar;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw new Error('No se pudo guardar el vehículo');
    }
  },

  /**
   * Actualiza un auto existente
   * @param {string} id - ID del auto
   * @param {Object} carData - Nuevos datos del auto
   * @returns {Object|null} Auto actualizado o null si no existe
   */
  update(id, carData) {
    try {
      const cars = this.getAll();
      const index = cars.findIndex(car => car.id === id);

      if (index === -1) {
        return null;
      }

      const updatedCar = {
        ...cars[index],
        ...carData,
        id: id, // Mantener el ID original
        updatedAt: new Date().toISOString()
      };

      cars[index] = updatedCar;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cars));
      return updatedCar;
    } catch (error) {
      console.error('Error al actualizar en localStorage:', error);
      throw new Error('No se pudo actualizar el vehículo');
    }
  },

  /**
   * Elimina un auto
   * @param {string} id - ID del auto
   * @returns {boolean} true si se eliminó, false si no existe
   */
  delete(id) {
    try {
      const cars = this.getAll();
      const filteredCars = cars.filter(car => car.id !== id);

      if (filteredCars.length === cars.length) {
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCars));
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      throw new Error('No se pudo eliminar el vehículo');
    }
  },

  /**
   * Filtra autos según criterios
   * @param {Object} filters - Objeto con criterios de filtrado
   * @returns {Array} Array de autos filtrados
   */
  filter(filters = {}) {
    let cars = this.getAll();

    if (filters.brand) {
      cars = cars.filter(car =>
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.year) {
      cars = cars.filter(car => car.year === parseInt(filters.year));
    }

    if (filters.maxPrice) {
      cars = cars.filter(car => car.price <= parseFloat(filters.maxPrice));
    }

    return cars;
  },

  /**
   * Obtiene todas las marcas únicas
   * @returns {Array} Array de marcas únicas ordenadas
   */
  getBrands() {
    const cars = this.getAll();
    const brands = [...new Set(cars.map(car => car.brand))];
    return brands.sort();
  },

  /**
   * Obtiene todos los años únicos
   * @returns {Array} Array de años únicos ordenados descendentemente
   */
  getYears() {
    const cars = this.getAll();
    const years = [...new Set(cars.map(car => car.year))];
    return years.sort((a, b) => b - a);
  },

  /**
   * Genera un ID único simple
   * @returns {string} ID único
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Limpia todos los datos (para testing)
   */
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  },

  /**
   * Inicializa datos de demostración si no hay autos
   */
  initDemoData() {
    if (this.getAll().length === 0) {
      const demoCars = [
        {
          brand: 'BMW',
          model: 'X5',
          year: 2023,
          price: 75000,
          mileage: 12000,
          transmission: 'Automática',
          fuelType: 'Gasolina',
          color: 'Negro',
          description: 'SUV de lujo con todas las comodidades. Excelente estado, un solo dueño.',
          imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
        },
        {
          brand: 'Mercedes-Benz',
          model: 'Clase C',
          year: 2024,
          price: 58000,
          mileage: 5000,
          transmission: 'Automática',
          fuelType: 'Híbrido',
          color: 'Plata',
          description: 'Sedán ejecutivo con tecnología híbrida. Perfecto para ciudad y carretera.',
          imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
        },
        {
          brand: 'Audi',
          model: 'A4',
          year: 2023,
          price: 52000,
          mileage: 18000,
          transmission: 'Automática',
          fuelType: 'Gasolina',
          color: 'Blanco',
          description: 'Elegancia y deportividad en un solo paquete. Mantenimiento al día.',
          imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
        },
        {
          brand: 'Tesla',
          model: 'Model 3',
          year: 2024,
          price: 48000,
          mileage: 8000,
          transmission: 'Automática',
          fuelType: 'Eléctrico',
          color: 'Rojo',
          description: 'Vehículo eléctrico con autopilot. Cero emisiones, máxima tecnología.',
          imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
        },
        {
          brand: 'Porsche',
          model: 'Cayenne',
          year: 2023,
          price: 95000,
          mileage: 15000,
          transmission: 'Automática',
          fuelType: 'Gasolina',
          color: 'Gris',
          description: 'SUV deportivo de alto rendimiento. Lujo y potencia combinados.',
          imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
        },
        {
          brand: 'Lexus',
          model: 'RX 350',
          year: 2024,
          price: 62000,
          mileage: 3000,
          transmission: 'Automática',
          fuelType: 'Híbrido',
          color: 'Azul',
          description: 'Confiabilidad japonesa con lujo premium. Híbrido eficiente.',
          imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
        }
      ];

      demoCars.forEach(car => this.save(car));
    }
  }
};

// Exportar para uso global (si no usas módulos ES6)
if (typeof window !== 'undefined') {
  window.CarStorage = CarStorage;
}
