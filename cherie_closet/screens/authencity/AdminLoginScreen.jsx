import {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import CustomHeader from '../../components/Header';
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

const AdminLoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  async function Posts() {
    try {
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCicEgdwdnSA9S6jEFbHKQjfu9R4pHKXCM',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const result = await response.json();
  
      if (response.ok) {
        const { localId, email } = result;

        const userResponse = await fetch(
          `https://cheriecloset-default-rtdb.firebaseio.com/Admin/${localId}.json`
        );
        const userInfo = await userResponse.json();
  
        if (userInfo) {
          const { username} = userInfo;
  
        
          alert(`Welcome ${username}!`);
  
          navigation.navigate('AdminDrawer', {
            username: username,
            userId: localId,
            email,
            
          });
        } else {
          alert("User info not found.");
        }
      } else {
        alert(result.error.message);
      }
    } catch (error) {
      console.log("Error Occurs:", error.message);
      alert("Network or server error occurred.");
    }
  }
  return (
    <SafeAreaView style={styles.overlay}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <CustomHeader navigation={navigation} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.brandName}>Cherie Closet</Text>
            <Text style={styles.adminTag}>ADMIN PORTAL</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>Secure access for management</Text>

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              placeholder="Enter admin email"
              style={[
                styles.input,
                focusedInput === 'email' && styles.inputFocused
              ]}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholderTextColor="#9E8E85"
              autoCapitalize="none"
            />

             <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              placeholder="Enter admin password"
              style={[
                styles.input,
                focusedInput === 'password' && styles.inputFocused
              ]}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#9E8E85"
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={Posts}
            >
              <Text style={styles.registerBtnText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('AdminRegister')}>
                <Text style={styles.loginLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminLoginScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: '#7C9A8A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  adminTag: {
    fontSize: 10,
    color: '#7C9A8A',
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  container: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#2C2C2C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9E8E85',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: '#2C2C2C',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#7C9A8A',
  },
  registerBtn: {
    backgroundColor: '#7C9A8A',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#9E8E85',
    fontSize: 14,
  },
  loginLink: {
    color: '#7C9A8A',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
