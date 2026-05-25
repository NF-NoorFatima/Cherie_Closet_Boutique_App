// OrderDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, Alert } from 'react-native';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetailsScreen({ route, navigation }) {
  const order = route.params?.order;
  const onOrderUpdated = route.params?.onOrderUpdated;

  if (!order || !order.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
        <Header title="Order Details" navigation={navigation} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#9E8E85" />
          <Text style={styles.errorText}>No order data found.</Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const updateStatus = async () => {
    try {
      const response = await fetch(
        `https://cheriecloset-default-rtdb.firebaseio.com/Orders/${order.id}.json`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'Confirmed' }),
        }
      );
      if (response.ok) {
        Alert.alert('Success', `Order ${order.id} status updated to Confirmed!`);
        onOrderUpdated?.();
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const cancelOrder = async () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order and move it to trash?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              const orderRef = `https://cheriecloset-default-rtdb.firebaseio.com/Orders/${order.id}.json`;
              const trashRef = `https://cheriecloset-default-rtdb.firebaseio.com/Trash/${order.id}.json`;

              const fetchRes = await fetch(orderRef);
              const orderData = await fetchRes.json();

              if (!orderData) {
                Alert.alert('Error', 'Order not found.');
                return;
              }

              await fetch(trashRef, {
                method: 'PUT',
                body: JSON.stringify({ ...orderData, status: 'Canceled' }),
              });

              const deleteRes = await fetch(orderRef, {
                method: 'DELETE',
              });

              if (deleteRes.ok) {
                Alert.alert('Success', `Order ${order.id} moved to Trash!`);
                onOrderUpdated?.();
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to remove from main list.');
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Something went wrong.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title={`Order #${order.id.slice(-6).toUpperCase()}`} navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>NAME</Text>
            <Text style={styles.value}>{order.customer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>{order.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>PHONE</Text>
            <Text style={styles.value}>{order.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ADDRESS</Text>
            <Text style={styles.value}>{order.address || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>STATUS</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: order.status === 'Confirmed' ? '#E8F5E9' : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: order.status === 'Confirmed' ? '#2E7D32' : '#E65100' }
              ]}>{order.status}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>DATE</Text>
            <Text style={styles.value}>{order.date || 'N/A'}</Text>
          </View>
        </View>

        {order.items && Array.isArray(order.items) && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name || 'Unnamed Item'}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                ${order.totalAmount || order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {order.status !== 'Confirmed' && (
            <TouchableOpacity style={styles.primaryButton} onPress={updateStatus}>
              <Text style={styles.primaryButtonText}>Confirm Order</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondaryButton} onPress={cancelOrder}>
            <Text style={styles.secondaryButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    marginBottom: 15,
    fontWeight: '600',
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
    fontSize: 15,
    color: '#2C2C2C',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#9E8E85',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#7C9A8A',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7C9A8A',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7C9A8A',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#9E8E85',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
});
