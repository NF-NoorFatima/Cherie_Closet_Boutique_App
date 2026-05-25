import React, { useState, useContext ,useEffect} from 'react';
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
import { UserContext } from '../../components/context/UserContext';

import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);
const { width } = Dimensions.get('window');

const EditAccount = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const userId = user?.userId;
  const email = user?.email;
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const [username, setUsername] = useState(user?.username || '');
  const [points, setPoints] = useState(loyaltyPoints);
  const [focusedInput, setFocusedInput] = useState(null);

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const res = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`);
        const data = await res.json();
        if (data?.loyaltyPoints !== undefined) {
          setPoints(data.loyaltyPoints);
        }
      } catch (err) {
        console.error('Error fetching latest loyalty points:', err);
      }
    };

    fetchLatestUserData();
  }, [userId]);

  const saveNewUsername = async () => {
    if (!newUsername.trim()) {
      alert('Username cannot be empty');
      return;
    }

    try {
      const response = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        alert('Username updated successfully');
        setUsername(newUsername);
        setUser({ ...user, username: newUsername });
        setShowUsernameModal(false);
        setNewUsername('');
      } else {
        alert('Failed to update username');
      }
    } catch (error) {
      console.log('Username update error:', error.message);
      alert('Something went wrong');
    }
  };

  const logoutUser = () => {
    alert('Logged out successfully');
    setUser(null);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.accountBox}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{username.charAt(0).toUpperCase() || 'C'}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowUsernameModal(true)} style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{username}</Text>
            </View>

            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{email}</Text>
            </View>

            <Text style={styles.fieldLabel}>LOYALTY STATUS</Text>
            <View style={styles.pointsBadge}>
              <Ionicons name="star" size={14} color="#7C9A8A" />
              <Text style={styles.pointsText}>{points} POINTS EARNED</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 10 }} />
            <Text style={styles.logoutText}>SIGN OUT</Text>
          </TouchableOpacity>
        </View>

        {/* Username Modal */}
        <Modal visible={showUsernameModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Name</Text>
                <TouchableOpacity onPress={() => setShowUsernameModal(false)}>
                  <Ionicons name="close" size={24} color="#2C2C2C" />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>NEW USERNAME</Text>
              <TextInput
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={setNewUsername}
                style={[styles.input, focusedInput === 'username' && styles.inputFocused]}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#9E8E85"
              />

              <TouchableOpacity onPress={saveNewUsername} style={styles.saveBtn}>
                <Text style={styles.saveText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAccount;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 25,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  accountBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
  },
  profileSection: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F4F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  avatarLetter: {
    fontSize: 40,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#7C9A8A',
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#7C9A8A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoSection: {
    width: '100%',
    marginBottom: 30,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 20,
  },
  infoRow: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  infoText: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7F5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#7C9A8A',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7C9A8A',
    letterSpacing: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#EF4444',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  saveBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

