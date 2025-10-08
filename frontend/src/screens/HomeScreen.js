import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userInfo, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, cerrar sesión',
          onPress: async () => {
            await logout();
            // ✅ NO navegar manualmente
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>
        Bienvenido, {userInfo?.usuario || 'Usuario'}
      </Text>

      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={globalStyles.buttonText}>Escanear Código QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary]}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={globalStyles.buttonText}>Ver Todos los Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: '#FF9500' }]}
          onPress={handleLogout}
        >
          <Text style={globalStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;