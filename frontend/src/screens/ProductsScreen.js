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

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const getStockStyle = (stock) => {
    if (stock === 0) return globalStyles.stockLow;
    if (stock < 10) return globalStyles.stockMedium;
    return globalStyles.stockHigh;
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'SIN STOCK';
    if (stock < 10) return `BAJO (${stock})`;
    return `DISPONIBLE (${stock})`;
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={globalStyles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>{item.nombre}</Text>
          <Text style={globalStyles.text}>Categoría: {item.categoria}</Text>
          <Text style={globalStyles.text}>Precio: ${item.precio}</Text>
        </View>
        <View style={[globalStyles.stockBadge, getStockStyle(item.stock)]}>
          <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold' }}>
            {getStockText(item.stock)}
          </Text>
        </View>
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
        Total de productos: {products.length}
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