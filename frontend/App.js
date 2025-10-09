import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ScanScreen from './src/screens/ScanScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from './src/utils/constants';

// Componente de carga
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.light 
  }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.dark }}>
      Cargando...
    </Text>
  </View>
);

const Stack = createNativeStackNavigator();

// Navigator para usuarios NO autenticados
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Navigator para usuarios autenticados  
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ 
        title: 'GM Stock',
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
      }}
    />
    <Stack.Screen 
      name="Products" 
      component={ProductsScreen}
      options={{ 
        title: 'Todos los Productos',
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
      }}
    />
    <Stack.Screen 
      name="Scan" 
      component={ScanScreen}
      options={{ 
        title: 'Escanear QR',
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
      }}
    />
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ 
        title: 'Detalle del Producto',
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
      }}
    />
  </Stack.Navigator>
);

// Navigator principal
const RootNavigator = () => {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return userToken ? <AppStack /> : <AuthStack />;
};

// App principal
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}