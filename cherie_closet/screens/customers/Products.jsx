import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

const { width } = Dimensions.get('window');
const containerPadding = 16;
const cardMargin = 10;
const cardWidth = (width - containerPadding * 2 - cardMargin) / 2;

const Products = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/All Products.json');
      const data = await response.json();
      const formattedData = Object.keys(data || {}).map((key) => ({
        id: key,
        name: data[key].name || 'Unnamed Product',
        image: data[key].image || 'https://via.placeholder.com/150',
        price: data[key].price || 0,
        tag: data[key].tag || 'N/A',
        size: data[key].size || [],
        category: data[key].category || 'Casual',
      }));
      setProducts(formattedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const resetFilters = () => {
    setSelectedSize('');
    setSelectedTag('');
    setPriceRange({ min: 0, max: 10000 });
  };

  const filteredProducts = products.filter((product) => {
    const withinPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSize = !selectedSize || (product.size && product.size.includes(selectedSize));
    const matchesTag = !selectedTag || product.tag === selectedTag;
    return withinPrice && matchesSize && matchesTag;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { width: cardWidth }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImage} 
          resizeMode="cover" 
        />
        {item.tag !== 'N/A' && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>Rs. {item.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Our Collection</Text>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color="#7C9A8A" />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeading}>Filter Products</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#2C2C2C" />
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>SIZE</Text>
                <View style={styles.pickerContainer}>
                  <Picker 
                    selectedValue={selectedSize} 
                    onValueChange={setSelectedSize} 
                    style={styles.picker}
                  >
                    <Picker.Item label="All Sizes" value="" />
                    <Picker.Item label="Small" value="S" />
                    <Picker.Item label="Medium" value="M" />
                    <Picker.Item label="Large" value="L" />
                    <Picker.Item label="XL" value="XL" />
                  </Picker>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>TAG</Text>
                <View style={styles.pickerContainer}>
                  <Picker 
                    selectedValue={selectedTag} 
                    onValueChange={setSelectedTag} 
                    style={styles.picker}
                  >
                    <Picker.Item label="All Items" value="" />
                    <Picker.Item label="New Arrival" value="New Arrival" />
                    <Picker.Item label="Sold Out" value="sold out" />
                    <Picker.Item label="On Sale" value="on sale" />
                  </Picker>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>PRICE RANGE</Text>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <TextInput
                      style={styles.priceInput}
                      value={priceRange.min.toString()}
                      onChangeText={(text) => setPriceRange((prev) => ({ ...prev, min: parseInt(text) || 0 }))}
                      keyboardType="numeric"
                      placeholder="Min"
                      placeholderTextColor="#9E8E85"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <TextInput
                      style={styles.priceInput}
                      value={priceRange.max.toString()}
                      onChangeText={(text) => setPriceRange((prev) => ({ ...prev, max: parseInt(text) || 10000 }))}
                      keyboardType="numeric"
                      placeholder="Max"
                      placeholderTextColor="#9E8E85"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text style={styles.resetButtonText}>RESET</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.applyButtonText}>APPLY FILTERS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#7C9A8A" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryButtonText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found matching your criteria.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    paddingHorizontal: containerPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  filterButtonText: {
    marginLeft: 6,
    color: '#7C9A8A',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: cardMargin,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#F9F9F9',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#7C9A8A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  productDetails: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#9E8E85',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalHeading: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 10,
    letterSpacing: 1,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  priceInput: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#7C9A8A',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#9E8E85',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9E8E85',
    fontSize: 16,
    textAlign: 'center',
  },
});

