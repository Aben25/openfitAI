import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // Navigation will be handled by the AuthGuard
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Navigation will be handled by the AuthGuard
    } catch (error) {
      Alert.alert('Google Sign In Failed', error.message || 'An error occurred during Google sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) throw error;
      // Navigation will be handled by the AuthGuard
    } catch (error) {
      Alert.alert('Apple Sign In Failed', error.message || 'An error occurred during Apple sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OpenFit AI</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <TouchableOpacity 
        style={[styles.socialButton, styles.googleButton]} 
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.socialButton, styles.appleButton]} 
        onPress={handleAppleSignIn}
        disabled={loading}
      >
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/auth/signup')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/auth/forgot-password')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonDisabled: {
    backgroundColor: '#a5c7f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  appleButtonText: {
    color: '#fff',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
  },
});
