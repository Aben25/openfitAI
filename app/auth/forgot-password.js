import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      setResetSent(true);
      Alert.alert(
        'Reset Link Sent',
        `A password reset link has been sent to ${email}`,
        [
          {
            text: 'Back to Login',
            onPress: () => router.push('/auth/login'),
          }
        ]
      );
    } catch (error) {
      Alert.alert('Reset Failed', error.message || 'An error occurred while sending the reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading && !resetSent}
      />
      
      <TouchableOpacity 
        style={[styles.button, (loading || resetSent) && styles.buttonDisabled]} 
        onPress={handleResetPassword}
        disabled={loading || resetSent}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {resetSent ? 'Reset Link Sent' : 'Send Reset Link'}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/auth/login')}
        disabled={loading}
      >
        <Text style={styles.linkText}>Back to Login</Text>
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
  linkButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
  },
});
