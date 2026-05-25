import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, SafeAreaView, StatusBar, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../components/context/UserContext';
import Header from '../../components/Header';

const SettingsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);

  const userId = user?.userId;
  const email = user?.email;
  const loyaltyPoints = user?.loyaltyPoints || 0;

  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [focusedInput, setFocusedInput] = useState(null);

  const saveNewUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      const response = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Username updated successfully');
        setUsername(newUsername);
        setShowUsernameModal(false);
        setNewUsername('');
      } else {
        Alert.alert('Error', 'Failed to update username');
      }
    } catch (error) {
      console.log('Username update error:', error.message);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const saveNewPassword = async () => {
    if (currentPassword !== password) {
      Alert.alert('Error', 'Current password is incorrect');
      return;
    }

    try {
      const response = await fetch(`https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Password changed successfully');
        setPassword(newPassword);
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Error', 'Failed to update password');
      }
    } catch (error) {
      console.log('Password update error:', error.message);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const deleteUserData = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `https://cheriecloset-default-rtdb.firebaseio.com/Users/${userId}.json`,
                { method: 'DELETE' }
              );

              if (response.ok) {
                Alert.alert('Account deleted');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                Alert.alert('Error', 'Failed to delete user');
              }
            } catch (error) {
              console.log("Delete error:", error.message);
              Alert.alert('Error', 'Network error while deleting user');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Settings" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Ionicons name="person-circle" size={80} color="#7C9A8A" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>
          
          <View style={styles.loyaltyBadge}>
            <Ionicons name="gift-outline" size={16} color="#7C9A8A" />
            <Text style={styles.loyaltyText}>{loyaltyPoints} Loyalty Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.optionsCard}>
            <TouchableOpacity style={styles.optionItem} onPress={() => setShowUsernameModal(true)}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F4F2' }]}>
                  <Ionicons name="person-outline" size={20} color="#7C9A8A" />
                </View>
                <Text style={styles.optionLabel}>Edit Username</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => setShowPasswordModal(true)}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F4F2' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#7C9A8A" />
                </View>
                <Text style={styles.optionLabel}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#E8E8E8" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={[styles.optionsCard, { borderColor: '#FFEBEE' }]}>
            <TouchableOpacity style={styles.optionItem} onPress={deleteUserData}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                </View>
                <Text style={[styles.optionLabel, { color: '#D32F2F' }]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FFEBEE" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Username Modal */}
      <Modal visible={showUsernameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Username</Text>
                <TouchableOpacity onPress={() => setShowUsernameModal(false)}>
                  <Ionicons name="close" size={24} color="#2C2C2C" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>NEW USERNAME</Text>
              <TextInput
                placeholder="Enter new username"
                placeholderTextColor="#9E8E85"
                value={newUsername}
                onChangeText={setNewUsername}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.input, focusedInput === 'username' && styles.focusedInput]}
              />
              
              <TouchableOpacity onPress={saveNewUsername} style={styles.modalSaveBtn}>
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name="close" size={24} color="#2C2C2C" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>CURRENT PASSWORD</Text>
              <TextInput
                placeholder="Enter current password"
                placeholderTextColor="#9E8E85"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onFocus={() => setFocusedInput('current')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.input, focusedInput === 'current' && styles.focusedInput, { marginBottom: 15 }]}
              />

              <Text style={styles.inputLabel}>NEW PASSWORD</Text>
              <TextInput
                placeholder="Enter new password"
                placeholderTextColor="#9E8E85"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setFocusedInput('new')}
                onBlur={() => setFocusedInput(null)}
                style={[styles.input, focusedInput === 'new' && styles.focusedInput]}
              />
              
              <TouchableOpacity onPress={saveNewPassword} style={styles.modalSaveBtn}>
                <Text style={styles.modalSaveText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    color: '#9E8E85',
    marginTop: 2,
  },
  loyaltyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loyaltyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C9A8A',
    marginLeft: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionLabel: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 44, 44, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
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
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2C2C2C',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#2C2C2C',
    marginBottom: 20,
  },
  focusedInput: {
    borderColor: '#7C9A8A',
  },
  modalSaveBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
