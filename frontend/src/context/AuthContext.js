import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUserToken(token);
        setUserInfo(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 NUEVA FUNCIÓN: Para limpiar auth cuando el token es inválido
  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUserInfo(null);
      console.log('✅ Autenticación limpiada por token inválido');
    } catch (error) {
      console.error('❌ Error limpiando auth:', error);
    }
  };

  const login = async (token, userData) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUserToken(token);
      setUserInfo(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async (token, userData) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUserToken(token);
      setUserInfo(userData);
    } catch (error) {
      console.error('Error during register:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    userToken,
    userInfo,
    isLoading,
    login,
    register,
    logout,
    clearAuth, // 👈 EXPORTAR esta función
    isAuthenticated: !!userToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};