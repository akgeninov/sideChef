import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import PropTypes from 'prop-types';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validasi masukan pengguna
    if (!email || !password) {
      Alert.alert('Login Failed', 'Please enter both email and password');
      return;
    }
  
    const requestBody = new URLSearchParams();
    requestBody.append('email', email);
    requestBody.append('password', password);
  
    console.log('Request Body:', requestBody.toString()); // Debug: Menampilkan body permintaan ke konsol sebelum melakukan fetch
  
    try {
      const response = await fetch('http://192.168.56.1/sideChef/db_sideChef.php?op=login_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody.toString(),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.data.result === 'Login Success') {
          // Navigasi ke HomeScreen hanya jika login berhasil
          navigation.navigate('HomeScreen');
        } else {
          Alert.alert('Login Failed', 'Invalid email or password');
        }
      } else {
        Alert.alert('Error', data.data.result);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };
  
  return (
    <View style={styles.container}>
        {/* <Image source={require('../images/Logo_sideChef.png')} style={styles.logo} /> */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.title2}>Login to your account</Text>
        <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.registerLink}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.registerLinkText}>Sign up</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 200, 
    height: 200, 
    marginBottom: 10, 
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  title2: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%', 
    marginBottom: 20,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10
  },
  loginButton: {
    backgroundColor: '#F58634',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  registerLink: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  registerLinkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  }
});

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LoginScreen;