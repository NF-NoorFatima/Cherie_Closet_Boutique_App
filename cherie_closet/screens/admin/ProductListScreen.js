import { useContext } from 'react';
import { 
  StyleSheet, 
  FlatList, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductContext } from '../../components/context/ProductContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

const ProductListScreen = () => {
  const { products } = useContext(ProductContext);
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category;

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase() &&
          !p.trashed
      )
    : products.filter((p) => !p.trashed);

  const handleEdit = (product) => {
    navigation.navigate('AddEditProduct', { product });
  };

  const moveToTrash = async (item) => {
    try {
      const originalPath = `https://cheriecloset-default-rtdb.firebaseio.com/Products/${item.id}.json`;
      const trashPath = `https://cheriecloset-default-rtdb.firebaseio.com/Trash/${item.id}.json`;

      await fetch(trashPath, {
        method: 'PUT',
        body: JSON.stringify(item),
      });

      const deleteRes = await fetch(originalPath, {
        method: 'DELETE',
      });

      if (deleteRes.ok) {
        alert('Product moved to trash.');
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error moving to trash:', error);
      alert('Something went wrong while deleting.');
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.image}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category?.toUpperCase() || 'GENERAL'}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>Rs. {parseFloat(item.price).toLocaleString()}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil-outline" size={16} color="#7C9A8A" />
            <Text style={styles.editBtnText}>EDIT</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => moveToTrash(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{selectedCategory || 'All Products'}</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddEditProduct')}
          >
            <Ionicons name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>ADD NEW</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shirt-outline" size={60} color="#E8E8E8" />
              <Text style={styles.emptyText}>No products found in this category.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductListScreen;

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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C9A8A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 5,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: cardWidth,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9E8E85',
    letterSpacing: 0.5,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C9A8A',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7F5',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7C9A8A',
    gap: 4,
  },
  editBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7C9A8A',
  },
  deleteBtn: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
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

