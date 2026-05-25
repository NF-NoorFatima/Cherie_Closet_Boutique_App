

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const categories = [
  { title: 'Casual', icon: 'shirt-outline' },
  { title: 'Wedding Dresses', icon: 'rose-outline' },
  { title: 'Coords', icon: 'grid-outline' },
  { title: 'Formal', icon: 'briefcase-outline' },
  { title: 'Signature', icon: 'star-outline' },
  { title: 'Saree', icon: 'flower-outline' },
  { title: 'Sale', icon: 'pricetag-outline' },
];

export default function AdminDashboardScreen({ navigation ,route}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { userId } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <View style={styles.quickActionBar}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color="#7C9A8A" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => navigation.navigate('Settings',{userId})}
            >
              <Ionicons name="settings-outline" size={20} color="#7C9A8A" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PRODUCTS</Text>
            <Text style={styles.statValue}>124</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ORDERS</Text>
            <Text style={styles.statValue}>48</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>COLLECTION MANAGEMENT</Text>
        
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate('ProductList', {
                  category: item.title,
                  searchQuery: searchQuery.trim(),
                })
              }
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={28} color="#7C9A8A" />
              </View>
              <Text style={styles.cardText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#E8E8E8" style={styles.cardChevron} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 25,
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  quickActionBar: {
    flexDirection: 'row',
    gap: 10,
  },
  quickButton: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: cardWidth,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardChevron: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

