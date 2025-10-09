import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { COLORS } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!usuario.trim()) {
      newErrors.usuario = "El usuario es requerido";
    } else if (usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 4) {
      newErrors.password = "La contraseña debe tener al menos 4 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login({ usuario, password });
      const { token, user } = response.data;

      await login(token, user);
    } catch (error) {
      let message = "Error al iniciar sesión";

      if (error.response) {
        // Manejar específicamente el error 401 de credenciales
        if (error.response.status === 401) {
          setErrors({
            general: "Usuario o contraseña incorrectos",
          });
          return;
        }

        message =
          error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.message === "Network Error") {
        message = "No se puede conectar al servidor. Verifica tu conexión.";
      } else {
        message = error.message || "Error desconocido";
      }

      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1,
          backgroundColor: "white",
          paddingVertical: 5,
        }}
        style={{ backgroundColor: "white" }}
      >
        <View style={[globalStyles.container]}>
          {/* Logo */}
          <View style={[globalStyles.logoContainer, { marginTop: 5}]}>
            <Image
              source={require("../../assets/logoGM.png")}
              style={globalStyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Mensaje de error general */}
          {errors.general && (
            <View
              style={{
                backgroundColor: "#FFE6E6",
                padding: 10,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.danger,
                width: '100%',
              }}
            >
              <Text style={{ color: COLORS.danger, fontSize: 14 }}>
                ⚠️ {errors.general}
              </Text>
            </View>
          )}

          {/* Campo Usuario */}
          <View style={{ width: '100%' }}>
            <TextInput
              style={[
                globalStyles.input,
                errors.usuario && { borderColor: COLORS.danger },
                { backgroundColor: "white" }
              ]}
              placeholder="Usuario"
              value={usuario}
              onChangeText={(text) => {
                setUsuario(text);
                clearError("usuario");
                clearError("general");
              }}
              autoCapitalize="none"
              editable={!isLoading}
              placeholderTextColor="#999"
            />
            {errors.usuario && (
              <Text
                style={{
                  color: COLORS.danger,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                {errors.usuario}
              </Text>
            )}
          </View>

          {/* Campo Contraseña */}
          <View style={{ width: '100%' }}>
            <TextInput
              style={[
                globalStyles.input,
                errors.password && { borderColor: COLORS.danger },
                { backgroundColor: "white" }
              ]}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError("password");
                clearError("general");
              }}
              secureTextEntry
              editable={!isLoading}
              placeholderTextColor="#999"
            />
            {errors.password && (
              <Text
                style={{
                  color: COLORS.danger,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                {errors.password}
              </Text>
            )}
          </View>

          {/* Botones  */}
          <View>
            <TouchableOpacity
              style={[globalStyles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSecondary]}
              onPress={() => navigation.navigate("Register")}
              disabled={isLoading}
            >
              <Text style={globalStyles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;