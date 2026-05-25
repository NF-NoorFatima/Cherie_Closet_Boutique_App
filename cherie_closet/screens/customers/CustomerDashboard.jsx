import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';
import Header from '../../components/Header';

const CustomerDashboard = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    alert('Logged out successfully');
    setUser(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Dashboard" navigation={navigation} />
      
      <View style={styles.container}>
        <View style={styles.accountCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#7C9A8A" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.accountName}>{user?.username || 'Valued Client'}</Text>
              <Text style={styles.accountEmail}>{user?.email || 'client@example.com'}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.loyaltyPoints || 0}</Text>
              <Text style={styles.statLabel}>POINTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Member</Text>
              <Text style={styles.statLabel}>STATUS</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('Orders')}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="receipt-outline" size={22} color="#7C9A8A" />
            </View>
            <Text style={styles.menuText}>Track Orders</Text>
            <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('WishList')}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="heart-outline" size={22} color="#7C9A8A" />
            </View>
            <Text style={styles.menuText}>My Wishlist</Text>
            <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate('Points')}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="star-outline" size={22} color="#7C9A8A" />
            </View>
            <Text style={styles.menuText}>Loyalty Program</Text>
            <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CustomerDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 24,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
  },
  accountEmail: {
    fontSize: 14,
    color: '#9E8E85',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E8E8E8',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0F4F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
