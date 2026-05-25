import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

const RoleSelector = ({ setRole }) => {
  return (
    <ImageBackground
      source={{
        uri: 'https://www.architectandinteriorsindia.com/cloud/2024/01/03/Shasha-Gabas-Store-designed-by-Saachi-Marwah-Rana-Interior-Designer3.jpg',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.brandName}>Cherie Closet</Text>
            <Text style={styles.tagline}>THE PINNACLE OF LUXURY</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setRole('customer')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>CONTINUE AS CUSTOMER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setRole('admin')}
              activeOpacity={0.8}
            >
              <Text style={styles.outlineButtonText}>ADMINISTRATION ACCESS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#7C9A8A',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 3,
    marginTop: 10,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default RoleSelector;

