import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';

export default function Welcome({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AdminRegister');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>C</Text>
        </View>
        <Text style={styles.title}>Chérie Closet</Text>
        <Text style={styles.subtitle}>ADMINISTRATION</Text>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#7C9A8A" />
        <Text style={styles.loaderText}>Initializing Portal</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FAF7F2' 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoMark: {
    width: 80,
    height: 80,
    backgroundColor: '#7C9A8A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Soft shadow for depth (optional, keeping it minimal)
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '600',
  },
  title: { 
    fontSize: 32, 
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 4,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
