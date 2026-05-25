import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

const { width } = Dimensions.get('window');
const containerPadding = 16;
const cardMargin = 10;
const cardWidth = (width - containerPadding * 2 - cardMargin) / 2;

const Wedding = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Wedding.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const formattedData = [];
      for (const key in data) {
        const item = data[key];
        formattedData.push({
          id: key,
          name: item.name || 'Unnamed Product',
          image: item.image || 'https://via.placeholder.com/150',
          price: item.price || 0,
          tag: item.tag || 'N/A',
          category: item.category || 'Wedding',
        });
      }

      setProducts(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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
          <Text style={styles.heading}>Wedding Collection</Text>
        </View>

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
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No wedding attire found in the collection.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Wedding;

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
    marginVertical: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
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
