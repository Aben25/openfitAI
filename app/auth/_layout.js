import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Sign In",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: "Create Account",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: "Reset Password",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
          headerShown: false
        }} 
      />
    </Stack>
  );
}
