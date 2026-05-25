import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Video } from 'expo-av';
import videoo from '../assets/video/videoo.mp4';
import { UserContext } from './context/UserContext';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Video
        source={videoo}
        style={styles.backgroundVideo}
        shouldPlay
        isLooping
        isMuted
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />

      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.brandName}>Cherie Closet</Text>
          <Text style={styles.tagline}>THE PINNACLE OF LUXURY</Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.welcomeText}>Welcome to the Collection</Text>
          <Text style={styles.description}>
            Discover timeless elegance and contemporary style curated just for you.
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('HomeScreen', { user })}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>EXPLORE NOW</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBox: {
    width: 70,
    height: 70,
    backgroundColor: '#7C9A8A',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '600',
  },
  brandName: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 3,
    marginTop: 8,
    opacity: 0.9,
    fontWeight: '500',
  },
  bottomSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 35,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#7C9A8A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
  },
});
