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
  const { product, onStockUpdate } = route.params; // Recibir callback
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
      
      if (onStockUpdate) {
        onStockUpdate(product._id, newStock);
      }
      
      Alert.alert(
        'Stock Actualizado', 
        `El stock de ${product.nombre} se actualizó correctamente a ${newStock} unidades.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'No se pudo actualizar el stock. Intenta nuevamente.');
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
        {/* Información del Producto */}
        <View style={[globalStyles.card, globalStyles.cardGold]}>
          <Text style={globalStyles.title}>{product.nombre}</Text>
          
          {/* Precio */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold', marginRight: 8 }]}>Precio:</Text>
            <Text style={[globalStyles.text, { fontSize: 20, fontWeight: 'bold', color: COLORS.accent }]}>
              ${product.precio}
            </Text>
          </View>

          {/* Categoría */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold', marginRight: 8 }]}>Categoría:</Text>
            <Text style={globalStyles.textSecondary}>{product.categoria}</Text>
          </View>

          {/* Stock Actual */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[globalStyles.text, { fontWeight: 'bold', marginRight: 8 }]}>Stock Actual:</Text>
            <Text style={[globalStyles.text, { fontSize: 20, fontWeight: 'bold', color: COLORS.warning }]}>
              {product.stock}
            </Text>
          </View>
        </View>

        {/* Actualizar Stock */}
        <View style={[globalStyles.card, globalStyles.cardAccent]}>
          <Text style={globalStyles.subtitle}>Actualizar Stock</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 }}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSecondary, { flex: 1, marginRight: 8 }]}
              onPress={decreaseStock}
              disabled={isLoading}
            >
              <Text style={[globalStyles.buttonText, { fontSize: 20 }]}>-</Text>
            </TouchableOpacity>

            <TextInput
              style={[
                globalStyles.input,
                { 
                  flex: 2, 
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: 'bold'
                }
              ]}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonSecondary, { flex: 1, marginLeft: 8 }]}
              onPress={increaseStock}
              disabled={isLoading}
            >
              <Text style={[globalStyles.buttonText, { fontSize: 20 }]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[globalStyles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleUpdateStock}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={globalStyles.buttonText}>Actualizar Stock</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductDetailScreen;