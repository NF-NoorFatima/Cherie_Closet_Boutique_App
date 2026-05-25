import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Linking, 
  TouchableOpacity, 
  ScrollView,
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

const ContactUs = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.header}>Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="chatbubbles-outline" size={40} color="#7C9A8A" />
          </View>
          <Text style={styles.title}>How can we assist you?</Text>
          <Text style={styles.subtitle}>Our dedicated team is here to ensure your Cherie Closet experience is flawless.</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+123456789')}
          >
            <View style={styles.itemIcon}>
              <Ionicons name="call-outline" size={22} color="#7C9A8A" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>PHONE</Text>
              <Text style={styles.itemValue}>+1 234 567 89</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:cherie_closet@boutique.com')}
          >
            <View style={styles.itemIcon}>
              <Ionicons name="mail-outline" size={22} color="#7C9A8A" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>EMAIL</Text>
              <Text style={styles.itemValue}>cherie_closet@boutique.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.contactItem}>
            <View style={styles.itemIcon}>
              <Ionicons name="location-outline" size={22} color="#7C9A8A" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>BOUTIQUE ADDRESS</Text>
              <Text style={styles.itemValue}>123 Luxury Street, Cherie Closet, PK</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.hoursHeader}>
            <Ionicons name="time-outline" size={20} color="#7C9A8A" />
            <Text style={styles.sectionTitle}>SERVICE HOURS</Text>
          </View>
          
          <View style={styles.hourRow}>
            <Text style={styles.dayText}>Monday - Friday</Text>
            <Text style={styles.timeText}>9 AM - 6 PM</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayText}>Saturday</Text>
            <Text style={styles.timeText}>10 AM - 4 PM</Text>
          </View>
          <View style={styles.hourRow}>
            <Text style={styles.dayText}>Sunday</Text>
            <Text style={[styles.timeText, { color: '#EF4444' }]}>Closed</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.chatButton}>
          <Text style={styles.chatButtonText}>START LIVE CHAT</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUs;

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
  heroSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#9E8E85',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9E8E85',
    letterSpacing: 1,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginLeft: 59,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayText: {
    fontSize: 14,
    color: '#2C2C2C',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C9A8A',
  },
  chatButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

