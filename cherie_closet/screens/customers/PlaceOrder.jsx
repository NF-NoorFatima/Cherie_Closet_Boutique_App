import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const PlaceOrder = ({ navigation, route }) => {
  const { product, cart, userId } = route.params || {};
  const items = cart ? cart : product ? [product] : [];

  if (!userId) {
    Alert.alert('Error', 'User not logged in!');
    navigation.goBack();
    return null;
  }

  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const validateInputs = () => {
    if (!username || !email || !address || !phone || !quantity) {
      alert('Please fill out all required fields.');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(username)) {
      alert('Name must contain only letters and spaces.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    if (!/^\d{11}$/.test(phone) || !phone.startsWith('03')) {
      alert('Phone number must be 11 digits and start with 03.');
      return false;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Quantity must be greater than 0.');
      return false;
    }

    if (qty > 20) {
      alert('You can order a maximum of 20 items.');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateInputs()) return;

    try {
      const qty = parseInt(quantity);
      const totalPrice = items.reduce((sum, item) => sum + item.price * qty, 0);
      const shippingPrice = 200;
      const discount = 0;
      const finalAmount = totalPrice + shippingPrice - discount;

      const order = {
        username,
        email,
        address,
        phone,
        quantity,
        note,
        discount,
        totalPrice,
        shippingPrice,
        finalAmount,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          selectedSize: item.selectedSize || null,
        })),
        status: 'Processing',
        date: new Date().toISOString(),
        userId,
      };

      await fetch('https://cheriecloset-default-rtdb.firebaseio.com/Orders.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}/Orders.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      alert('Order placed successfully!');
      navigation.navigate('Orders', { userId });

    } catch (error) {
      console.error('Order placement error:', error);
      alert('Something went wrong.');
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * (parseInt(quantity) || 1), 0);
  const shippingPrice = 200;
  const finalAmount = totalPrice + shippingPrice;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
            </TouchableOpacity>
            <Text style={styles.header}>Checkout</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
            {items.map((item, index) => (
              <View key={index} style={styles.productRow}>
                <Image 
                  source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                  style={styles.productImage} 
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productMeta}>Size: {item.selectedSize || 'N/A'}</Text>
                  <Text style={styles.productPrice}>Rs. {parseFloat(item.price).toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>SHIPPING INFORMATION</Text>
            
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'name' && styles.inputFocused]} 
              placeholder="Enter your full name" 
              value={username} 
              onChangeText={setName}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />

            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'email' && styles.inputFocused]} 
              placeholder="Enter your email" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>SHIPPING ADDRESS</Text>
            <TextInput 
              style={[styles.input, styles.textArea, focusedInput === 'address' && styles.inputFocused]} 
              placeholder="Complete home or office address" 
              value={address} 
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              onFocus={() => setFocusedInput('address')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />

            <Text style={styles.fieldLabel}>CONTACT NUMBER</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'phone' && styles.inputFocused]} 
              placeholder="03XXXXXXXXX" 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad" 
              maxLength={11}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>QUANTITY</Text>
                <TextInput 
                  style={[styles.input, focusedInput === 'qty' && styles.inputFocused]} 
                  placeholder="1" 
                  value={quantity} 
                  onChangeText={setQuantity} 
                  keyboardType="numeric"
                  onFocus={() => setFocusedInput('qty')}
                  onBlur={() => setFocusedInput(null)}
                  placeholderTextColor="#9E8E85"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>ORDER NOTES (OPTIONAL)</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'note' && styles.inputFocused]} 
              placeholder="Special instructions for delivery" 
              value={note} 
              onChangeText={setNote}
              onFocus={() => setFocusedInput('note')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />
          </View>

          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>Rs. {totalPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Shipping Fee</Text>
              <Text style={styles.billValue}>Rs. {shippingPrice.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>Rs. {finalAmount.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderText}>CONFIRM ORDER</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    paddingHorizontal: 25,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  header: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  productImage: {
    width: 60,
    height: 70,
    borderRadius: 10,
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
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C9A8A',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 20,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: '#9E8E85',
  },
  billValue: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#7C9A8A',
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
});
