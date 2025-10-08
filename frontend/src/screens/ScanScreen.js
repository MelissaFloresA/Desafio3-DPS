import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { globalStyles } from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { productsAPI } from '../services/api';

const ScanScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    
    setScanned(true);
    setIsLoading(true);

    try {
      console.log('QR escaneado:', data);
      
      // Asumimos que el QR contiene el ID del producto
      const productId = data.trim();
      
      const response = await productsAPI.getById(productId);
      const product = response.data;
      
      navigation.navigate('ProductDetail', { product });
    } catch (error) {
      console.error('Error al buscar producto:', error);
      Alert.alert(
        'Producto no encontrado',
        'El código QR no corresponde a un producto válido',
        [
          {
            text: 'OK',
            onPress: () => setScanned(false),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={globalStyles.container}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>
          Necesitamos permisos para usar la cámara
        </Text>
        <TouchableOpacity style={globalStyles.button} onPress={requestPermission}>
          <Text style={globalStyles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
          {isLoading && (
            <View style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <ActivityIndicator size="large" color={COLORS.white} />
              <Text style={{ color: COLORS.white, marginTop: 16 }}>Buscando producto...</Text>
            </View>
          )}
          
          <View style={{ padding: 20, backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <Text style={{ color: COLORS.white, textAlign: 'center', marginBottom: 16 }}>
              Escanea el código QR del producto
            </Text>
            
            {scanned && (
              <TouchableOpacity
                style={globalStyles.button}
                onPress={() => setScanned(false)}
              >
                <Text style={globalStyles.buttonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSecondary, { marginTop: 8 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={globalStyles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default ScanScreen;