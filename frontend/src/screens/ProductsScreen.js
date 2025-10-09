import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { COLORS } from '../utils/constants';
import { productsAPI } from '../services/api';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // actualizar stock localmente para no refrescar pantalla
  const handleStockUpdate = (productId, newStock) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product._id === productId 
          ? { ...product, stock: newStock } 
          : product
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={globalStyles.card}
      onPress={() => navigation.navigate('ProductDetail', { 
        product: item,
        onStockUpdate: handleStockUpdate 
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>
            {item.nombre}
          </Text>
          <Text style={globalStyles.textSecondary}>
            {item.categoria}
          </Text>
          <Text style={globalStyles.text}>
            ${item.precio}
          </Text>
        </View>
        
        {/* STOCK */}
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: COLORS.warning,
          backgroundColor: '#FFF3E0',
          padding: 8,
          borderRadius: 6,
          minWidth: 40,
          textAlign: 'center',
        }}>
          {item.stock}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[globalStyles.text, { marginTop: 16 }]}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.subtitle}>
        Productos: {products.length}
      </Text>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductsScreen;