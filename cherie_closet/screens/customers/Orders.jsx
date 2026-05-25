import { useState, useEffect ,useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const Orders = () => {
  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [orders, setOrders] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    if (!userId) return;
    loadUserData(userId);
  }, [userId]);

  const loadUserData = async (userId) => {
    await Promise.all([
      fetchLoyaltyPoints(userId),
      fetchUserOrders(userId),
    ]);
  };

  const fetchLoyaltyPoints = async (userId) => {
    try {
      const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`);
      const userData = await res.json();
      setLoyaltyPoints(userData.loyaltyPoints || 0);
    } catch (error) {
      console.error('Failed to fetch loyalty points:', error);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Orders.json`);
      const ordersData = await res.json();

      if (!ordersData) {
        setOrders([]);
        return;
      }

      const fetchedOrders = [];
      for (const orderId in ordersData) {
        const order = ordersData[orderId];
        fetchedOrders.push({ ...order, orderId });
      }

      setOrders(fetchedOrders.reverse());
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const userOrderPath = `https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Orders/${orderId}.json`;
      const globalOrdersPath = `https://cheriecloset-default-rtdb.firebaseio.com/Orders.json`;
      const userPath = `https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`;

      const res = await fetch(userOrderPath);
      const order = await res.json();

      if (!order || order.status !== 'Processing') {
        alert('Only orders with status "Processing" can be canceled.');
        return;
      }

      const userRes = await fetch(userPath);
      const userData = await userRes.json();
      const currentPoints = userData?.loyaltyPoints || 0;

      const adjustedPoints = currentPoints - (order.pointsEarned || 0);
      const finalPoints = adjustedPoints < 0 ? 0 : adjustedPoints;

      await fetch(userPath, {
        method: 'PATCH',
        body: JSON.stringify({ loyaltyPoints: finalPoints }),
      });

      await fetch(userOrderPath, { method: 'DELETE' });

      const globalRes = await fetch(globalOrdersPath);
      const allOrders = await globalRes.json();

      for (const globalOrderId in allOrders) {
        const globalOrder = allOrders[globalOrderId];

        if (
          globalOrder.email === order.email &&
          globalOrder.date === order.date &&
          globalOrder.finalAmount === order.finalAmount
        ) {
          await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Orders/${globalOrderId}.json`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'Canceled', pointsEarned: 0 }),
          });
          break;
        }
      }

      alert('Order canceled successfully');
      fetchUserOrders(userId);
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Something went wrong while canceling the order.');
    }
  };

  const getTrackingStatus = (orderDate, originalStatus) => {
    if (originalStatus === 'Canceled') return 'Canceled';
    const placed = new Date(orderDate);
    const today = new Date();
    const diff = Math.floor((today - placed) / (1000 * 60 * 60 * 24));

    if (diff < 1) return 'Processing';
    if (diff === 1) return 'Shipped';
    if (diff <= 3) return 'On The Way';
    return 'Delivered';
  };

  const renderItem = ({ item }) => {
    const status = getTrackingStatus(item.date, item.status);
    const subtotal = item.totalPrice || 0;
    const discount = item.discount || 0;
    const shipping = item.shippingPrice || 0;
    const final = item.finalAmount || subtotal + shipping - discount;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdText}>Order #{item.orderId.slice(-6).toUpperCase()}</Text>
            <Text style={styles.dateText}>{new Date(item.date).toDateString()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status === 'Canceled' ? '#FEE2E2' : '#F4F7F5' }]}>
            <Text style={[styles.statusText, { color: status === 'Canceled' ? '#EF4444' : '#7C9A8A' }]}>{status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {item.items?.map((prod, idx) => (
          <View key={idx} style={styles.productRow}>
            <Image
              source={typeof prod.image === 'string' ? { uri: prod.image } : prod.image}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
              <Text style={styles.productMeta}>Size: {prod.selectedSize} | Qty: {prod.quantity || 1}</Text>
              <Text style={styles.productPrice}>Rs. {parseFloat(prod.price).toLocaleString()}</Text>
            </View>
          </View>
        ))}

        <View style={styles.billContainer}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>Rs. {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Shipping</Text>
            <Text style={styles.billValue}>Rs. {shipping.toLocaleString()}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Discount</Text>
              <Text style={[styles.billValue, { color: '#7C9A8A' }]}>-Rs. {discount.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>Rs. {final.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          {item.status === 'Processing' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => cancelOrder(item.orderId)}
            >
              <Text style={styles.cancelBtnText}>CANCEL ORDER</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.trackBtn}>
            <Text style={styles.trackBtnText}>TRACK ORDER</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Orders</Text>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={14} color="#FFFFFF" />
            <Text style={styles.pointsText}>{loyaltyPoints} POINTS</Text>
          </View>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#E8E8E8" />
            <Text style={styles.emptyText}>No orders found yet</Text>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>DISCOVER COLLECTION</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.orderId}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Orders;

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
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C9A8A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderIdText: {
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
  productRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImage: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 12,
    color: '#9E8E85',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  billContainer: {
    backgroundColor: '#FAF7F2',
    padding: 15,
    borderRadius: 15,
    marginTop: 5,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 12,
    color: '#9E8E85',
  },
  billValue: {
    fontSize: 12,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7C9A8A',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  trackBtn: {
    flex: 1,
    backgroundColor: '#7C9A8A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#9E8E85',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#9E8E85',
    marginTop: 20,
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

