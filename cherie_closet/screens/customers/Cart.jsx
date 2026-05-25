import { useState, useEffect, useContext } from 'react';
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
import app from "../../firebaseConsole";
import { getDatabase, ref, onValue, remove } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const Cart = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const cartRef = ref(db, `Users/${userId}/Cart`);
    
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formattedData = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      setCartData(formattedData);
    });

    return () => unsubscribe();
  }, [userId]);

  const deleteData = async (id) => {
    try {
      await remove(ref(db, `Users/${userId}/Cart/${id}`));
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const totalPrice = cartData.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.image} 
      />
      <View style={styles.info}>
        <View style={styles.infoHeader}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity style={styles.removeBtn} onPress={() => deleteData(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#9E8E85" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>SIZE</Text>
            <Text style={styles.detailValue}>{item.selectedSize || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TAG</Text>
            <Text style={styles.detailValue}>{item.tag || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.price}>Rs. {parseFloat(item.price).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <Text style={styles.header}>Shopping Bag</Text>
        
        {cartData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={80} color="#E8E8E8" />
            <Text style={styles.emptyText}>Your bag is empty</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>START SHOPPING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cartData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.totalValue}>Rs. {totalPrice.toLocaleString()}</Text>
              </View>

              <TouchableOpacity
                style={styles.placeOrderBtn}
                onPress={() =>
                  navigation.navigate('PlaceOrder', { cart: cartData, userId: user?.userId })
                }
              >
                <Text style={styles.placeOrderText}>PROCEED TO CHECKOUT</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Cart;

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
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  image: {
    width: 100,
    height: 120,
    backgroundColor: '#F9F9F9',
  },
  info: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 10,
  },
  removeBtn: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#9E8E85',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 10,
    color: '#2C2C2C',
    fontWeight: '700',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: -20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: 'bold',
  },
  placeOrderBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 14,
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
