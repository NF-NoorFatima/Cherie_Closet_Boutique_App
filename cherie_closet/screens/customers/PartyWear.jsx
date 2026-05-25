import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');
const containerPadding = 16;
const cardMargin = 10;
const cardWidth = (width - containerPadding * 2 - cardMargin) / 2;

const products = [
  {
    id: '1',
    name: 'Charara Dress',
    price: 19000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/16908700b0b8b16b73e1e2880bf237d8.jpg'),
  },
  {
    id: '2',
    name: 'Gharara',
    price: 10000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/35_5be44164-8db1-4945-85ec-01e4fb300fb4.jpg'),
  },
  {
    id: '3',
    name: 'Long Shirt',
    price: 12000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/3_74ab5975-b521-4f27-9c3d-a3c2b6b44192.jpeg'),
  },
  {
    id: '4',
    name: 'Fancy Dress',
    price: 30000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/3f0099aac52027d7c6b38ce2a9ccdc5a_1.jpg'),
  },
  {
    id: '5',
    name: 'Elegant Party Dress',
    price: 20000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/7792809ac43df172c94c1a7ee8327288_7f500352-a021-4066-99c3-7ea7633312d1.jpg')
  },
  {
    id: '6',
    name: 'Designer Wear',
    price: 15000,
    tag: 'New Arrival',
    category: 'Party Wear',
    image: require('../../../cherie_closet/assets/images/party/7aa6dba622329a9fe624a74dcd9c8327.jpg'),
  },
];

const PartyWear = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { width: cardWidth }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id, item })}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
        {item.tag && (
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
          <Text style={styles.heading}>Party Collection</Text>
        </View>

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default PartyWear;

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
});

