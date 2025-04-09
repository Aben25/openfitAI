import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  
  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const { data, error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message || 'Failed to send reset email');
      } else {
        setMessage('Password reset instructions have been sent to your email');
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
            <Text className="text-textSecondary text-center">Reset your password</Text>
          </View>
          
          <View className="bg-card p-6 rounded-xl border border-border mb-4">
            <Text className="text-textSecondary mb-4 text-center">
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
            
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
            
            {/* Error Message */}
            {error ? (
              <Text className="text-error mb-4 text-center">{error}</Text>
            ) : null}
            
            {/* Success Message */}
            {message ? (
              <Text className="text-success mb-4 text-center">{message}</Text>
            ) : null}
            
            {/* Reset Button */}
            <TouchableOpacity
              className="bg-primary py-3 rounded-full mb-4"
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-center">Send Reset Instructions</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Back to Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-textSecondary mr-1">Remember your password?</Text>
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
