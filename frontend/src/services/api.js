import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar la función clearAuth
let clearAuthFunction = null;

export const setClearAuth = (clearAuth) => {
  clearAuthFunction = clearAuth;
};

// Interceptor para requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas - CORREGIDO
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Solo limpiar token si es error 401 y NO es endpoint de auth
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url.includes('/auth/');
      
      if (!isAuthEndpoint) {
        console.log('🛑 Token inválido o expirado - Limpiando autenticación');
        if (clearAuthFunction) {
          clearAuthFunction();
        } else {
          // Fallback
          try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
          } catch (storageError) {
            console.error('Error clearing storage:', storageError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const productsAPI = {
  getAll: () => api.get('/products/obtener'),
  getById: (id) => api.get(`/products/obtener/${id}`),
  updateStock: (id, stock) => api.post(`/products/actualizar/${id}`, { stock }),
  create: (productData) => api.post('/products/crear', productData),
};

export default api;