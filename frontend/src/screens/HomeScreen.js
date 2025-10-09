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
      '¿Estás seguro de que quieres cerrar sesión de GM Stock?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, cerrar sesión', onPress: async () => await logout() },
      ]
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={[globalStyles.subtitle, { textAlign: 'center', marginBottom: 16 }]}>
        Bienvenido {userInfo?.usuario || 'Usuario'}
      </Text>

    {/*card de acciones rápidas*/}
      <View style={[globalStyles.card, globalStyles.cardGold]}>
        <Text style={globalStyles.subtitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={globalStyles.buttonText}>Escanear Código QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonAccent]}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={globalStyles.buttonText}>Ver Todos los Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary]}
          onPress={handleLogout}
        >
          <Text style={globalStyles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>¿Cómo Usar GM Stock?</Text>
        <Text style={globalStyles.textSecondary}>
          • Escanea códigos QR para ver información de productos en tienda
        </Text>
        <Text style={globalStyles.textSecondary}>
          • Actualiza el stock desde el detalle de cada producto o escaneando
        </Text>
        <Text style={globalStyles.textSecondary}>
          • Consulta el inventario completo en cualquier momento
        </Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;