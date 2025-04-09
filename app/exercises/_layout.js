import { View, Text, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useState } from 'react';

// Mock data for exercises
const MOCK_EXERCISES = [
  { id: '1', name: 'Squats', targetMuscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '2', name: 'Bench Press', targetMuscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '3', name: 'Deadlifts', targetMuscle: 'Back', equipment: 'Barbell', difficulty: 'Advanced' },
  { id: '4', name: 'Pull-ups', targetMuscle: 'Back', equipment: 'Body Weight', difficulty: 'Intermediate' },
  { id: '5', name: 'Push-ups', targetMuscle: 'Chest', equipment: 'Body Weight', difficulty: 'Beginner' },
  { id: '6', name: 'Lunges', targetMuscle: 'Legs', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { id: '7', name: 'Shoulder Press', targetMuscle: 'Shoulders', equipment: 'Dumbbell', difficulty: 'Intermediate' },
  { id: '8', name: 'Bicep Curls', targetMuscle: 'Arms', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { id: '9', name: 'Tricep Extensions', targetMuscle: 'Arms', equipment: 'Cable', difficulty: 'Beginner' },
  { id: '10', name: 'Plank', targetMuscle: 'Core', equipment: 'Body Weight', difficulty: 'Beginner' },
];

export default function ExercisesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Exercise Library",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: "Exercise Details",
          headerStyle: {
            backgroundColor: '#5D4FEB',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}
