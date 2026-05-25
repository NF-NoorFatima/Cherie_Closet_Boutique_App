import React, { useState, useEffect ,useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Review from './Review'
import {UserContext} from '../../components/context/UserContext'
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const { width } = Dimensions.get('window');
const db = getDatabase(app);

const ProductDetails = ({ navigation, route }) => {
  const productId = route?.params?.productId;
  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          'https://cheriecloset-default-rtdb.firebaseio.com/All Products.json'
        );
        const data = await response.json();

        if (data && data[productId]) {
          const selectedData = data[productId];
          const productObj = {
            id: productId,
            ...selectedData,
            image: selectedData.image,
            moreImages: selectedData.moreImages || [],
            size: selectedData.size || [],
            tag: selectedData.tag || null,
          };

          setProduct(productObj);
          setMainImage(productObj.image);
        } else {
          alert('Product not found');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const AddToCart = async (item) => {
    if (!userId) return alert('Please login to add to cart');
    try {
      const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Cart.json`);
      const data = await res.json();
      
      const exists = Object.values(data || {}).some(
        (entry) => entry.productId === item.id
      );
      if (exists) return alert('Already exists in your Cart');

      const payload = {
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        selectedSize,
        tag: item.tag || null,
        userId,
      };

      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Cart.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Cart.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      alert('✅ Added to cart!');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Something went wrong.');
    }
  };

  const postWishlist = async (item) => {
    if (!userId) return alert('Please login to add to wishlist');
    try {
      const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Wishlist.json`);
      const data = await res.json();
      
      const exists = Object.values(data || {}).some(
        (entry) => entry.productId === item.id
      );
      if (exists) return alert('Already exists in your Wishlist');

      const payload = {
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        selectedSize,
        tag: item.tag || null,
        userId,
      };

      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Wishlist.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Wishlist.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      alert('❤️ Added to wishlist!');
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error);
      alert('Something went wrong.');
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7C9A8A" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  const allImages = [product.image, ...product.moreImages];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image source={typeof mainImage === 'string' ? { uri: mainImage } : mainImage} style={styles.mainImage} />
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>

          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={() => postWishlist(product)} style={styles.iconCircle}>
              <Ionicons name="heart-outline" size={22} color="#7C9A8A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => AddToCart(product)} style={styles.iconCircle}>
              <Ionicons name="cart-outline" size={22} color="#7C9A8A" />
            </TouchableOpacity>
          </View>

          {product.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{product.tag.toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.thumbnailContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailScroll}>
            {allImages.map((img, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setMainImage(img)}
                style={[
                  styles.thumbnailWrapper,
                  mainImage === img && styles.activeThumbnail
                ]}
              >
                <Image 
                  source={typeof img === 'string' ? { uri: img } : img} 
                  style={styles.thumbnailImage} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>Rs. {product.price.toLocaleString()}</Text>
          </View>

          <Text style={styles.label}>SELECT SIZE</Text>
          <View style={styles.sizeContainer}>
            {product.size.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBox,
                  selectedSize === size && styles.selectedSizeBox
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={styles.description} numberOfLines={showMore ? undefined : 3}>
            {product.description || 'This premium piece from Cherie Closet embodies luxury and sophistication. Crafted with the finest materials to ensure both comfort and style for your special occasions.'}
          </Text>
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text style={styles.showMoreText}>{showMore ? 'Read Less' : 'Read More'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() =>
              navigation.navigate('PlaceOrder', {
                product: { ...product, selectedSize },
                userId: user?.userId,
              })
            }
          >
            <Text style={styles.orderButtonText}>PLACE ORDER</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          <Review productId={product.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
  },
  loadingText: {
    marginTop: 10,
    color: '#9E8E85',
  },
  imageSection: {
    width: width,
    height: width * 1.2,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcons: {
    position: 'absolute',
    top: 50,
    right: 20,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#7C9A8A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  thumbnailContainer: {
    backgroundColor: '#FAF7F2',
    paddingVertical: 15,
  },
  thumbnailScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  thumbnailWrapper: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#7C9A8A',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C9A8A',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 10,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  sizeBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedSizeBox: {
    borderColor: '#7C9A8A',
    backgroundColor: '#F4F7F5',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  selectedSizeText: {
    color: '#7C9A8A',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#2C2C2C',
    marginBottom: 8,
  },
  showMoreText: {
    color: '#7C9A8A',
    fontWeight: '600',
    marginBottom: 30,
  },
  orderButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 30,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    marginBottom: 15,
  },
});
