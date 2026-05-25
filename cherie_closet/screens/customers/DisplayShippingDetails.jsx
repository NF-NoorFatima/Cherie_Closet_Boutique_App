import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const ShippingDetails = ({ navigation }) => {
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    fetchShippingDetails();
  }, []);

  const fetchShippingDetails = async () => {
    try {
      const response = await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Orders.json');
      const data = await response.json();

      const formattedData = Object.keys(data || {}).map(key => ({
        id: key,
        name: data[key].name || data[key].username || 'N/A',
        email: data[key].email || 'N/A',
        address: data[key].address || 'N/A',
        phone: data[key].phone || 'N/A',
      }));

      setShippingData(formattedData.reverse());
    } catch (error) {
      console.error('Error fetching shipping details:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color="#7C9A8A" />
        </View>
        <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>NAME</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>EMAIL</Text>
        <Text style={styles.value}>{item.email}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>PHONE</Text>
        <Text style={styles.value}>{item.phone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>ADDRESS</Text>
        <Text style={styles.value}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Shipping Overview" navigation={navigation} />
      
      <FlatList
        data={shippingData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="boat-outline" size={60} color="#E8E8E8" />
            <Text style={styles.emptyText}>No shipping records found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ShippingDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
    letterSpacing: 0.5,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    color: '#9E8E85',
    lineHeight: 20,
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
