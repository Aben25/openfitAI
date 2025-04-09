import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import SignupScreen from '../../../src/screens/auth/SignupScreen';

export default function Signup() {
  return <SignupScreen />;
}
