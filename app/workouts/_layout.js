import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function WorkoutsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Workouts",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: "Workout Details",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: "Create Workout",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}
