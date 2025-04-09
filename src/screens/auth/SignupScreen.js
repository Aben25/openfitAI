import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();
  
  const handleSignup = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        setError(signUpError.message || 'Failed to sign up');
      } else {
        // Successfully signed up
        // In a real app, you might want to show a verification message
        // or automatically log the user in
        router.replace('/auth/login');
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
            <Text className="text-textSecondary text-center">Create a new account</Text>
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
                placeholder="Create a password"
                placeholderTextColor="#757575"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            
            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className="text-textSecondary mb-1">Confirm Password</Text>
              <TextInput
                className="bg-background text-text p-3 rounded-lg border border-border"
                placeholder="Confirm your password"
                placeholderTextColor="#757575"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            
            {/* Error Message */}
            {error ? (
              <Text className="text-error mb-4 text-center">{error}</Text>
            ) : null}
            
            {/* Signup Button */}
            <TouchableOpacity
              className="bg-primary py-3 rounded-full mb-4"
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-center">Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Sign In Link */}
          <View className="flex-row justify-center">
            <Text className="text-textSecondary mr-1">Already have an account?</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
