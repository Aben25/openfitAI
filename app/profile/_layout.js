import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profile",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}
