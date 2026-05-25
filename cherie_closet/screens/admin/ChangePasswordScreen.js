import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    // Normally you'd make an API call here
    Alert.alert('Success', 'Password changed successfully');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <Header title="Security" navigation={navigation} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <Text style={styles.helperText}>Ensure your account is using a long, random password to stay secure.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CURRENT PASSWORD</Text>
              <TextInput
                style={[styles.input, focusedInput === 'current' && styles.focusedInput]}
                placeholder="Enter current password"
                placeholderTextColor="#9E8E85"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onFocus={() => setFocusedInput('current')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NEW PASSWORD</Text>
              <TextInput
                style={[styles.input, focusedInput === 'new' && styles.focusedInput]}
                placeholder="Enter new password"
                placeholderTextColor="#9E8E85"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => setFocusedInput('new')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
              <TextInput
                style={[styles.input, focusedInput === 'confirm' && styles.focusedInput]}
                placeholder="Repeat new password"
                placeholderTextColor="#9E8E85"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
              <Text style={styles.submitButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#7C9A8A" />
            <Text style={styles.securityText}>
              Your security is our priority. If you suspect any unauthorized access, contact support immediately.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    fontWeight: '600',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#9E8E85',
    marginBottom: 25,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
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
  },
  focusedInput: {
    borderColor: '#7C9A8A',
  },
  submitButton: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: '#9E8E85',
    marginLeft: 15,
    lineHeight: 18,
  },
});
