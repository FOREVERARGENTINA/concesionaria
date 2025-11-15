/* ========================================
   STORAGE MODULE - Firebase Firestore Management
   ======================================== */

const CarStorage = {
  COLLECTION_NAME: 'cars',

  /**
   * Obtiene todos los autos de Firestore
   * @returns {Promise<Array>} Array de objetos de autos
   */
  async getAll() {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const snapshot = await db.collection(this.COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .get();

      const cars = [];
      snapshot.forEach(doc => {
        cars.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return cars;
    } catch (error) {
      console.error('Error al leer de Firestore:', error);
      throw new Error('No se pudieron cargar los vehículos');
    }
  },

  /**
   * Obtiene un auto por ID
   * @param {string} id - ID del auto
   * @returns {Promise<Object|null>} Objeto del auto o null si no existe
   */
  async getById(id) {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const doc = await db.collection(this.COLLECTION_NAME).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw new Error('No se pudo obtener el vehículo');
    }
  },

  /**
   * Guarda un nuevo auto
   * @param {Object} carData - Datos del auto
   * @returns {Promise<Object>} Auto guardado con ID
   */
  async save(carData) {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const newCar = {
        ...carData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection(this.COLLECTION_NAME).add(newCar);

      return {
        id: docRef.id,
        ...carData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      throw new Error('No se pudo guardar el vehículo');
    }
  },

  /**
   * Actualiza un auto existente
   * @param {string} id - ID del auto
   * @param {Object} carData - Nuevos datos del auto
   * @returns {Promise<Object|null>} Auto actualizado o null si no existe
   */
  async update(id, carData) {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const docRef = db.collection(this.COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      const updatedData = {
        ...carData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await docRef.update(updatedData);

      return {
        id: id,
        ...doc.data(),
        ...carData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al actualizar en Firestore:', error);
      throw new Error('No se pudo actualizar el vehículo');
    }
  },

  /**
   * Elimina un auto
   * @param {string} id - ID del auto
   * @returns {Promise<boolean>} true si se eliminó, false si no existe
   */
  async delete(id) {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const docRef = db.collection(this.COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar de Firestore:', error);
      throw new Error('No se pudo eliminar el vehículo');
    }
  },

  /**
   * Filtra autos según criterios
   * @param {Object} filters - Objeto con criterios de filtrado
   * @returns {Promise<Array>} Array de autos filtrados
   */
  async filter(filters = {}) {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      let query = db.collection(this.COLLECTION_NAME);

      // Firestore requiere índices para queries compuestas
      // Por ahora, obtenemos todos y filtramos en memoria
      const cars = await this.getAll();
      let filteredCars = cars;

      if (filters.brand) {
        filteredCars = filteredCars.filter(car =>
          car.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
      }

      if (filters.year) {
        filteredCars = filteredCars.filter(car => car.year === parseInt(filters.year));
      }

      if (filters.maxPrice) {
        filteredCars = filteredCars.filter(car => car.price <= parseFloat(filters.maxPrice));
      }

      return filteredCars;
    } catch (error) {
      console.error('Error al filtrar vehículos:', error);
      throw new Error('No se pudieron filtrar los vehículos');
    }
  },

  /**
   * Obtiene todas las marcas únicas
   * @returns {Promise<Array>} Array de marcas únicas ordenadas
   */
  async getBrands() {
    try {
      const cars = await this.getAll();
      const brands = [...new Set(cars.map(car => car.brand))];
      return brands.sort();
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return [];
    }
  },

  /**
   * Obtiene todos los años únicos
   * @returns {Promise<Array>} Array de años únicos ordenados descendentemente
   */
  async getYears() {
    try {
      const cars = await this.getAll();
      const years = [...new Set(cars.map(car => car.year))];
      return years.sort((a, b) => b - a);
    } catch (error) {
      console.error('Error al obtener años:', error);
      return [];
    }
  },

  /**
   * Limpia todos los datos (para testing - usar con precaución)
   */
  async clear() {
    try {
      if (!window.db) {
        throw new Error('Firestore no está inicializado');
      }

      const snapshot = await db.collection(this.COLLECTION_NAME).get();
      const batch = db.batch();

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('Todos los vehículos eliminados');
    } catch (error) {
      console.error('Error al limpiar Firestore:', error);
      throw new Error('No se pudieron eliminar los vehículos');
    }
  },

  /**
   * Inicializa datos de demostración si no hay autos
   */
  async initDemoData() {
    try {
      const cars = await this.getAll();

      if (cars.length === 0) {
        console.log('Inicializando datos de demostración...');

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

        // Guardar todos los autos de demostración
        const promises = demoCars.map(car => this.save(car));
        await Promise.all(promises);

        console.log('Datos de demostración cargados exitosamente');
      }
    } catch (error) {
      console.error('Error al inicializar datos de demostración:', error);
    }
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.CarStorage = CarStorage;
}
