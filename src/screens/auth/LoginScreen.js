import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message || 'Failed to sign in');
      } else {
        // Successfully logged in, navigate to home
        router.replace('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="flex-grow">
        <View className="flex-1 p-6 justify-center">
          <View className="items-center mb-8">
            <Text className="text-primary text-3xl font-bold mb-2">FitTrack</Text>
            <Text className="text-textSecondary text-center">Sign in to your account</Text>
          </View>
          
          <View className="bg-card p-6 rounded-xl border border-border mb-4">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-textSecondary mb-1">Email</Text>
              <TextInput
                className="bg-background text-text p-3 rounded-lg border border-border"
                placeholder="Enter your email"
                placeholderTextColor="#757575"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-textSecondary mb-1">Password</Text>
              <TextInput
                className="bg-background text-text p-3 rounded-lg border border-border"
                placeholder="Enter your password"
                placeholderTextColor="#757575"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            
            {/* Error Message */}
            {error ? (
              <Text className="text-error mb-4 text-center">{error}</Text>
            ) : null}
            
            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary py-3 rounded-full mb-4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-center">Sign In</Text>
              )}
            </TouchableOpacity>
            
            {/* Forgot Password Link */}
            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-primary text-center">Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-textSecondary mr-1">Don't have an account?</Text>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <Text className="text-primary">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
