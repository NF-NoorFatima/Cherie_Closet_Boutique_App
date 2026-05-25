import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, navigation, showBack = true, children }) => {
  const canGoBack = navigation && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBack && canGoBack && (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#7C9A8A" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title || 'Cherie Closet'}</Text>
        </View>

        <View style={styles.rightContainer}>
          {/* Placeholder for right actions if needed */}
        </View>
      </View>
      {children && (
        <View style={styles.wrapper}>
          {children}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF7F2',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#FAF7F2',
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 3,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 5,
  },
  titleText: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    letterSpacing: 1,
    fontWeight: '600',
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

