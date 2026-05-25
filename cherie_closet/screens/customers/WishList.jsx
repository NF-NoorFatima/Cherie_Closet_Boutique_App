import { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';

const { width } = Dimensions.get('window');

const WishList = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [wishListData, setWishListData] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  async function fetchData() {
    try {
      const response = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Wishlist.json`);
      const data = await response.json();

      const formattedData = [];
      for (const key in data) {
        formattedData.push({
          id: key,
          name: data[key].name,
          price: data[key].price,
          image: data[key].image,
          selectedSize: data[key].selectedSize,
          tag: data[key].tag || null,
        });
      }
      setWishListData(formattedData);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }

  async function deleteData(id) {
    try {
      const response = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Wishlist/${id}.json`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting from wishlist:', error);
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.productId || item.id })}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.image} 
      />
      <View style={styles.info}>
        <View style={styles.infoHeader}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity style={styles.removeBtn} onPress={() => deleteData(item.id)}>
            <Ionicons name="heart" size={20} color="#7C9A8A" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailsRow}>
          {item.selectedSize && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SIZE</Text>
              <Text style={styles.detailValue}>{item.selectedSize}</Text>
            </View>
          )}
          {item.tag && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>TAG</Text>
              <Text style={styles.detailValue}>{item.tag}</Text>
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>Rs. {parseFloat(item.price).toLocaleString()}</Text>
          <TouchableOpacity 
            style={styles.addToBagBtn}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.productId || item.id })}
          >
            <Text style={styles.addToBagText}>VIEW PRODUCT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <Text style={styles.header}>Wishlist</Text>
        
        {wishListData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#E8E8E8" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>DISCOVER PRODUCTS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishListData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WishList;

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
    width: 110,
    height: 140,
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
    marginTop: 4,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  addToBagBtn: {
    backgroundColor: '#F4F7F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C9A8A',
  },
  addToBagText: {
    fontSize: 10,
    color: '#7C9A8A',
    fontWeight: '700',
    letterSpacing: 0.5,
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

