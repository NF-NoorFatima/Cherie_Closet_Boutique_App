import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const LoyaltyPoints = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [points, setPoints] = useState(user?.loyaltyPoints || 0);

  useEffect(() => {
    if (user?.userId) {
      const fetchPoints = async () => {
        try {
          const userRef = ref(db, `Users/${user.userId}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setPoints(snapshot.val().loyaltyPoints || 0);
          }
        } catch (error) {
          console.error('Error fetching points:', error);
        }
      };
      fetchPoints();
    }
  }, [user?.userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.header}>Loyalty Rewards</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="star" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>TOTAL POINTS EARNED</Text>
          
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{points > 1000 ? 'PLATINUM MEMBER' : points > 500 ? 'GOLD MEMBER' : 'SILVER MEMBER'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
          
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Ionicons name="cart-outline" size={20} color="#7C9A8A" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Shop & Earn</Text>
              <Text style={styles.benefitDesc}>Earn 1 point for every Rs. 100 spent on our luxury collection.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Ionicons name="gift-outline" size={20} color="#7C9A8A" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Redeem Rewards</Text>
              <Text style={styles.benefitDesc}>Every 100 points can be redeemed for exclusive discounts on your next order.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Ionicons name="diamond-outline" size={20} color="#7C9A8A" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Elite Access</Text>
              <Text style={styles.benefitDesc}>Higher tiers enjoy early access to new arrivals and private sales.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>EARN MORE POINTS</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoyaltyPoints;

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
  heroCard: {
    backgroundColor: '#7C9A8A',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#7C9A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 56,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pointsLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.9,
    marginBottom: 20,
  },
  tierBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tierText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C9A8A',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 25,
  },
  benefitRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: '#9E8E85',
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#7C9A8A',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

