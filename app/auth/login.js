import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import LoginScreen from '../../../src/screens/auth/LoginScreen';

export default function Login() {
  return <LoginScreen />;
}
