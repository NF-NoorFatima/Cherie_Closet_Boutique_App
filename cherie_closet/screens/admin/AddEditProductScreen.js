import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const AddEditProductScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!name || !price || !category || !image) {
      alert("Please fill all fields before saving.");
      return;
    }

    const newProduct = {
      name: name,
      price: parseFloat(price),
      category: category,
      image: image,
      size: ['S', 'M', 'L', 'XL'],
      tag: 'New Arrival',
      moreImages: []
    };

    try {
      const response = await fetch(
        `https://cheriecloset-default-rtdb.firebaseio.com/${category}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        alert("Product added successfully!");
        navigation.navigate('Dashboard');
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
            </TouchableOpacity>
            <Text style={styles.header}>Inventory</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>PRODUCT DETAILS</Text>

            <Text style={styles.fieldLabel}>PRODUCT NAME</Text>
            <TextInput
              placeholder="e.g. Silk Evening Gown"
              value={name}
              onChangeText={setName}
              style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />

            <Text style={styles.fieldLabel}>PRICE (RS.)</Text>
            <TextInput
              placeholder="e.g. 15000"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={[styles.input, focusedInput === 'price' && styles.inputFocused]}
              onFocus={() => setFocusedInput('price')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
            />

            <Text style={styles.fieldLabel}>COLLECTION</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Collection" value="" color="#9E8E85" />
                <Picker.Item label="All Collections" value="All Products" />
                <Picker.Item label="Casual Wear" value="Casual" />
                <Picker.Item label="Wedding Collection" value="Wedding" />
                <Picker.Item label="Signature Series" value="Signature" />
                <Picker.Item label="Seasonal Sale" value="Sale" />
                <Picker.Item label="Co-ord Sets" value="Cords" />
                <Picker.Item label="Formal Attire" value="Formal" />
              </Picker>
            </View>

            <Text style={styles.fieldLabel}>PRODUCT MEDIA</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
              {image ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <View style={styles.changeOverlay}>
                    <Ionicons name="camera" size={20} color="#FFFFFF" />
                    <Text style={styles.changeText}>CHANGE IMAGE</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="cloud-upload-outline" size={40} color="#7C9A8A" />
                  <Text style={styles.placeholderText}>UPLOAD PRODUCT IMAGE</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>PUBLISH PRODUCT</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEditProductScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    paddingHorizontal: 25,
    paddingBottom: 40,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 25,
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
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imagePicker: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 20,
  },
  placeholderContainer: {
    height: 150,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  placeholderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7C9A8A',
    letterSpacing: 1,
  },
  previewContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(124, 154, 138, 0.8)',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});

