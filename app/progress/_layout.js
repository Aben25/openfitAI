import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function ProgressLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: 'Back',
        }}
      />
    </>
  );
}
