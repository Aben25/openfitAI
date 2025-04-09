import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import ForgotPasswordScreen from '../../../src/screens/auth/ForgotPasswordScreen';

export default function ForgotPassword() {
  return <ForgotPasswordScreen />;
}
