import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    const requestBody = new URLSearchParams();
    requestBody.append('username', username);
    requestBody.append('email', email);
    requestBody.append('password', password);
  
    console.log('Request Body:', requestBody.toString()); // Debug: Menampilkan body permintaan ke konsol sebelum melakukan fetch
  
    try {
      const response = await fetch('http://192.168.56.1/sideChef/db_sideChef.php?op=register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody.toString(),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', data.data.result);
        navigation.navigate('LoginScreen');
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
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.title2}>Create your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Text style={styles.terms}>By registering your are agreeing to our Terms of use and Privacy Policy.</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginLink}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLinkText}>Login</Text>
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
    backgroundColor: 'white'
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
    backgroundColor: 'white',
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  button: {
    backgroundColor: '#F58634',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  loginLinkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  terms: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  }
});

export default SignUpScreen;