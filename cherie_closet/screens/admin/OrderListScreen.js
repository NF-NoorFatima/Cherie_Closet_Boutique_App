import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

export default function OrderListScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Orders.json');
      const data = await response.json();
      const formatted = [];

      for (const key in data) {
        const order = data[key];
        formatted.push({
          id: key,
          customer: order.username || 'Unknown',
          status: order.status || 'Pending',
          ...order,
        });
      }

      setOrders(formatted.reverse()); // most recent first
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return { bg: '#F4F7F5', text: '#7C9A8A' };
      case 'Confirmed': return { bg: '#E0F2FE', text: '#0284C7' };
      case 'Shipped': return { bg: '#F3E8FF', text: '#9333EA' };
      case 'Delivered': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Canceled': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('OrderDetailsScreen', {
            order: item,
            onOrderUpdated: fetchOrders,
          })
        }
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.dateText}>{new Date(item.date).toDateString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.customerRow}>
          <View style={styles.customerIcon}>
            <Ionicons name="person-outline" size={18} color="#7C9A8A" />
          </View>
          <View>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.customerEmail}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.amountLabel}>GRAND TOTAL</Text>
          <Text style={styles.amountValue}>Rs. {parseFloat(item.finalAmount || 0).toLocaleString()}</Text>
          <Ionicons name="chevron-forward" size={16} color="#E8E8E8" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Orders</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
            <Ionicons name="refresh" size={20} color="#7C9A8A" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#7C9A8A" />
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={60} color="#E8E8E8" />
                <Text style={styles.emptyText}>No orders to manage yet.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9E8E85',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 15,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  customerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  customerEmail: {
    fontSize: 12,
    color: '#9E8E85',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 1,
    flex: 1,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7C9A8A',
    marginRight: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    color: '#9E8E85',
    fontSize: 14,
  },
});

