import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';

export default function ProgressLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Progress",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="weight-history" 
        options={{ 
          title: "Weight History",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="workout-history" 
        options={{ 
          title: "Workout History",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}
