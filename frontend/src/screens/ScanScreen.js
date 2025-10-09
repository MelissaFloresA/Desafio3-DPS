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
      
      // El QR contiene el ID del producto
      const productId = data.trim();
      
      const response = await productsAPI.getById(productId);
      const product = response.data;
      
      console.log('Producto encontrado:', product.nombre);
      
      // Navegar a la pantalla de detalle con la información del producto
      navigation.navigate('ProductDetail', { product });
      
    } catch (error) {
      console.error('Error al buscar producto:', error);
      Alert.alert(
        'Producto No Encontrado',
        'El código QR no corresponde a un producto válido en el sistema.',
        [
          {
            text: 'Intentar Nuevamente',
            onPress: () => setScanned(false),
          },
          {
            text: 'Volver',
            onPress: () => navigation.goBack(),
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
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[globalStyles.text, { textAlign: 'center', marginBottom: 20 }]}>
          GM Stock necesita acceso a la cámara para escanear códigos QR de productos.
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
        <View style={globalStyles.scannerOverlay}>
          {isLoading && (
            <View style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center',
            }}>
              <View style={[globalStyles.card, { padding: 20, alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[globalStyles.text, { marginTop: 16 }]}>Buscando producto...</Text>
              </View>
            </View>
          )}
          
          <View style={{ padding: 20, backgroundColor: 'rgba(30, 144, 255, 0.9)' }}>
            <Text style={{ 
              color: COLORS.text, 
              textAlign: 'center', 
              marginBottom: 16, 
              fontSize: 18,
              fontWeight: 'bold'
            }}>
              Escanea el código QR del producto
            </Text>
            <Text style={{ 
              color: COLORS.text, 
              textAlign: 'center', 
              marginBottom: 20,
              fontSize: 14 
            }}>
              Apunta la cámara hacia el código QR del producto para ver su información y stock.
            </Text>
            
            {scanned && (
              <TouchableOpacity
                style={[globalStyles.button, globalStyles.buttonSecondary]}
                onPress={() => setScanned(false)}
              >
                <Text style={globalStyles.buttonText}>Escanear Otro Código</Text>
              </TouchableOpacity>
            )}
            
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default ScanScreen;