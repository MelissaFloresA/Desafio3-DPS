import React, { useState } from 'react';
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
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { productsAPI } from '../services/api';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [stock, setStock] = useState(product.stock.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStock = async () => {
    const newStock = parseInt(stock, 10);
    
    if (isNaN(newStock) || newStock < 0) {
      Alert.alert('Error', 'Por favor ingresa un número válido para el stock');
      return;
    }

    setIsLoading(true);
    try {
      await productsAPI.updateStock(product._id, newStock);
      Alert.alert('Éxito', 'Stock actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'No se pudo actualizar el stock');
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseStock = () => {
    const currentStock = parseInt(stock, 10);
    if (currentStock > 0) {
      setStock((currentStock - 1).toString());
    }
  };

  const increaseStock = () => {
    const currentStock = parseInt(stock, 10);
    setStock((currentStock + 1).toString());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.container}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.title}>{product.nombre}</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Categoría:</Text>
            <Text style={globalStyles.text}>{product.categoria}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Código QR:</Text>
            <Text style={globalStyles.text}>{product.qr}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Precio:</Text>
            <Text style={globalStyles.text}>${product.precio}</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Stock Actual:</Text>
            <Text style={[globalStyles.text, { fontSize: 18, fontWeight: 'bold' }]}>
              {product.stock} unidades
            </Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Actualizar Stock</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 }}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonDanger, { flex: 1, marginRight: 8 }]}
              onPress={decreaseStock}
              disabled={isLoading}
            >
              <Text style={globalStyles.buttonText}>-</Text>
            </TouchableOpacity>

            <TextInput
              style={[
                globalStyles.input,
                { 
                  flex: 2, 
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold'
                }
              ]}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSuccess, { flex: 1, marginLeft: 8 }]}
              onPress={increaseStock}
              disabled={isLoading}
            >
              <Text style={globalStyles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[globalStyles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleUpdateStock}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={globalStyles.buttonText}>Actualizar Stock</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductDetailScreen; // ✅ EXPORT DEFAULT