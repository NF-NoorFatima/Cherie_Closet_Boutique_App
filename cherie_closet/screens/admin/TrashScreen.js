import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Header from '../../components/Header';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrashScreen({ navigation }) {
  const [trashedOrders, setTrashedOrders] = useState([]);
  const [trashedProducts, setTrashedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('orders'); // 'orders' or 'products'

  useEffect(() => {
    fetchTrashData();
  }, []);

  const fetchTrashData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Trash.json');
      const data = await response.json();

      const orders = [];
      const products = [];

      for (const key in data) {
        const item = data[key];

        if (item?.username && item?.status) {
          // It's an order
          orders.push({
            id: key,
            customer: item.username,
            status: item.status,
            email: item.email || 'N/A',
            date: item.date || 'N/A',
          });
        } else if (item?.name) {
          // It's a product
          products.push({
            id: key,
            name: item.name,
            price: item.price || 'N/A',
            category: item.category || 'N/A',
          });
        }
      }

      setTrashedOrders(orders.reverse());
      setTrashedProducts(products.reverse());
    } catch (error) {
      console.error('Error fetching trash data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Order #{item.id.slice(-6).toUpperCase()}</Text>
        <View style={styles.trashBadge}>
          <Text style={styles.trashBadgeText}>DELETED</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={14} color="#9E8E85" />
        <Text style={styles.infoText}>{item.customer}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={14} color="#9E8E85" />
        <Text style={styles.infoText}>{item.email}</Text>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.trashBadge}>
          <Text style={styles.trashBadgeText}>DELETED</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="pricetag-outline" size={14} color="#9E8E85" />
        <Text style={styles.infoText}>{item.category}</Text>
      </View>
      <View style={styles.footerRow}>
        <Text style={styles.priceText}>Rs {item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Trash" navigation={navigation} />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'orders' && styles.activeTab]}
          onPress={() => setViewMode('orders')}
        >
          <Text style={[styles.tabText, viewMode === 'orders' && styles.activeTabText]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'products' && styles.activeTab]}
          onPress={() => setViewMode('products')}
        >
          <Text style={[styles.tabText, viewMode === 'products' && styles.activeTabText]}>Products</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C9A8A" />
          <Text style={styles.loadingText}>Retrieving deleted items...</Text>
        </View>
      ) : (
        <FlatList
          data={viewMode === 'orders' ? trashedOrders : trashedProducts}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'orders' ? renderOrder : renderProduct}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="trash-outline" size={60} color="#E8E8E8" />
              <Text style={styles.emptyText}>Trash is empty.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#7C9A8A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E8E85',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
    flex: 1,
  },
  trashBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trashBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#9E8E85',
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  dateText: {
    fontSize: 12,
    color: '#9E8E85',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D32F2F',
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
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
