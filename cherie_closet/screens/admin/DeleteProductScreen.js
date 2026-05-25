import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const DeleteProductScreen = ({ navigation }) => {
  const [category, setCategory] = useState('');
  const [productId, setProductId] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleDelete = async () => {
    if (!category.trim() || !productId.trim()) {
      Alert.alert('Error', 'Please select a category and enter a product ID.');
      return;
    }

    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product and move it to trash?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const productRef = `https://cheriecloset-default-rtdb.firebaseio.com/${category}/${productId}.json`;
            const trashRef = `https://cheriecloset-default-rtdb.firebaseio.com/Trash/${productId}.json`;

            try {
              const fetchRes = await fetch(productRef);
              const productData = await fetchRes.json();

              if (!productData) {
                Alert.alert('Error', 'Product not found.');
                return;
              }

              await fetch(trashRef, {
                method: 'PUT',
                body: JSON.stringify(productData),
              });

              const deleteRes = await fetch(productRef, {
                method: 'DELETE',
              });

              if (deleteRes.ok) {
                Alert.alert('Success', 'Product deleted and moved to Trash.');
                setProductId('');
                setCategory('');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to delete the product.');
              }
            } catch (error) {
              console.error('Deletion error:', error);
              Alert.alert('Error', 'Something went wrong during deletion.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Delete Product" navigation={navigation} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <View style={styles.infoContainer}>
              <Ionicons name="warning-outline" size={24} color="#7C9A8A" />
              <Text style={styles.infoText}>
                Deleting a product will move it to the trash. You can restore it later if needed.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SELECT CATEGORY</Text>
              <View style={[
                styles.pickerWrapper,
                focusedInput === 'category' && styles.focusedInput
              ]}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  onFocus={() => setFocusedInput('category')}
                  onBlur={() => setFocusedInput(null)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select category" value="" color="#9E8E85" />
                  <Picker.Item label="All Products" value="All Products" />
                  <Picker.Item label="Casual" value="Casual" />
                  <Picker.Item label="Wedding Dress" value="Wedding" />
                  <Picker.Item label="Signature" value="Signature" />
                  <Picker.Item label="Sale" value="Sale" />
                  <Picker.Item label="Coords" value="Cords" />
                  <Picker.Item label="Formal" value="Formal" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PRODUCT ID</Text>
              <TextInput
                placeholder="Enter Product ID"
                placeholderTextColor="#9E8E85"
                value={productId}
                onChangeText={setProductId}
                onFocus={() => setFocusedInput('productId')}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === 'productId' && styles.focusedInput
                ]}
              />
            </View>

            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete Product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeleteProductScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9F8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#9E8E85',
    marginLeft: 12,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#2C2C2C',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#2C2C2C',
  },
  focusedInput: {
    borderColor: '#7C9A8A',
  },
  deleteButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
