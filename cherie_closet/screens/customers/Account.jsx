import React,{useContext,useState} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {UserContext} from '../../components/context/UserContext'
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const userId = user?.userId;
  const email = user?.email;  
  const [password, setPassword] = useState(user?.password || '');
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const idToken = user?.idToken;

  const saveNewPassword = async () => {
    if (currentPassword !== password) {
      alert('Current password is incorrect');
      return;
    }
  
    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCicEgdwdnSA9S6jEFbHKQjfu9R4pHKXCM',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: idToken,
            password: newPassword,
            returnSecureToken: true
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data?.error?.message || 'Failed to update password');
        return;
      }
  
      await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${user.userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
  
      setUser({
        ...user,
        idToken: data.idToken,
        password: newPassword,
      });
  
      alert('Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.log('Password update error:', error.message);
      alert('Something went wrong');
    }
  };
     
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileCard}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditAccount', { userId, email })}
            style={styles.avatarContainer}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{user?.username?.charAt(0).toUpperCase() || 'C'}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.usernameText}>{user?.username || 'Valued Client'}</Text>
            <Text style={styles.emailText}>{email}</Text>
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={14} color="#7C9A8A" />
              <Text style={styles.pointsText}>{user?.loyaltyPoints || 0} LOYALTY POINTS</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Orders')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="receipt-outline" size={22} color="#7C9A8A" />
          </View>
          <Text style={styles.menuLabel}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color="#E8E8E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setShowPasswordModal(true)}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#7C9A8A" />
          </View>
          <Text style={styles.menuLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#E8E8E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ContactUs')}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="chatbubbles-outline" size={22} color="#7C9A8A" />
          </View>
          <Text style={styles.menuLabel}>Customer Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#E8E8E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
          <Text style={styles.logoutText}>SIGN OUT</Text>
        </TouchableOpacity>

        <Modal visible={showPasswordModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Security</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name="close" size={24} color="#2C2C2C" />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>CURRENT PASSWORD</Text>
              <TextInput
                placeholder="Enter current password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                style={[styles.input, focusedInput === 'current' && styles.inputFocused]}
                onFocus={() => setFocusedInput('current')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#9E8E85"
              />

              <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
              <TextInput
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={[styles.input, focusedInput === 'new' && styles.inputFocused]}
                onFocus={() => setFocusedInput('new')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#9E8E85"
              />

              <TouchableOpacity onPress={saveNewPassword} style={styles.saveBtn}>
                <Text style={styles.saveText}>UPDATE PASSWORD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  header: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    textAlign: 'center',
    marginVertical: 30,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  avatarLetter: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#7C9A8A',
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7C9A8A',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#9E8E85',
    marginBottom: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F7F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7C9A8A',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  logoutBtn: {
    marginTop: 30,
    marginBottom: 50,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    width: '90%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
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
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  saveBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

