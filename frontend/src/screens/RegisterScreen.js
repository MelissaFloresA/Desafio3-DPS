import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { COLORS } from '../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authAPI.register({ usuario, password });
      await register(response.data.token, response.data.user);
    } catch (error) {
      // setErrors
      let message = 'Error en el registro';
      
      if (error.response) {
        if (error.response.status === 401) {
          setErrors({ general: 'El usuario ya existe' });
          return;
        }
        message = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.message === 'Network Error') {
        message = 'No se puede conectar al servidor. Verifica tu conexión.';
      } else {
        message = error.message || 'Error desconocido';
      }
      
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      {errors.general && (
        <View style={{
          backgroundColor: '#FFE6E6',
          padding: 10,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: COLORS.danger,
          marginBottom: 15,
          width: '100%',
        }}>
          <Text style={{ color: COLORS.danger, fontSize: 14 }}>
            ⚠️ {errors.general}
          </Text>
        </View>
      )}
      
      {/* input Usuario */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            errors.usuario && { borderColor: COLORS.danger }
          ]}
          placeholder="Usuario"
          value={usuario}
          onChangeText={(text) => {
            setUsuario(text);
            clearError('usuario');
            clearError('general'); 
          }}
          autoCapitalize="none"
        />
        {errors.usuario && (
          <Text style={styles.errorText}>{errors.usuario}</Text>
        )}
      </View>
      
      {/* input Contra */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            errors.password && { borderColor: COLORS.danger }
          ]}
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError('password');
            clearError('general'); 
          }}
          secureTextEntry
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={handleLogin}
      >
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});

export default RegisterScreen;