import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const categories = ['Casual', 'Formal', 'Saree', 'Cords', 'Signature', 'Wedding'];

const StockManagementScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const allProducts = [];
    try {
      for (const category of categories) {
        const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/${category}.json`);
        const data = await res.json();

        if (data) {
          for (const key in data) {
            const product = data[key];
            allProducts.push({
              id: key,
              ...product,
              category: category,
              dbPath: `${category}/${key}`,
            });
          }
        }
      }
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (product, change) => {
    const newQuantity = Math.max(0, (product.quantity || 0) + change);
    try {
      await fetch(
        `https://cheriecloset-default-rtdb.firebaseio.com/${product.dbPath}.json`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id && p.category === product.category
            ? { ...p, quantity: newQuantity }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.categoryLabel}>{item.category}</Text>
        <View style={styles.stockInfo}>
          <Text style={styles.stockLabel}>STOCK LEVEL</Text>
          <Text style={[
            styles.stockValue,
            { color: item.quantity < 5 ? '#E53935' : '#7C9A8A' }
          ]}>
            {item.quantity ?? 0}
          </Text>
        </View>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          onPress={() => updateQuantity(item, -1)} 
          style={styles.controlButton}
        >
          <Ionicons name="remove" size={18} color="#7C9A8A" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => updateQuantity(item, 1)} 
          style={[styles.controlButton, styles.plusButton]}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Stock Management" navigation={navigation} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C9A8A" />
          <Text style={styles.loadingText}>Syncing inventory...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.category}-${item.id}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={60} color="#E8E8E8" />
              <Text style={styles.emptyText}>No products found in inventory.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default StockManagementScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#9E8E85',
    fontSize: 14,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    marginBottom: 16,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FAF7F2',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#9E8E85',
    marginBottom: 8,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C9A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  plusButton: {
    backgroundColor: '#7C9A8A',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#9E8E85',
    textAlign: 'center',
  },
});
