import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

// Mock data for workout details
const MOCK_WORKOUT = {
  id: '1',
  name: 'Full Body Strength',
  description: 'A comprehensive workout targeting all major muscle groups for overall strength and conditioning.',
  exercises: [
    { id: '1', name: 'Squats', sets: 3, reps: 12, weight: '50kg', targetMuscle: 'Quadriceps', restTime: '60s' },
    { id: '2', name: 'Bench Press', sets: 3, reps: 10, weight: '40kg', targetMuscle: 'Chest', restTime: '90s' },
    { id: '3', name: 'Deadlifts', sets: 3, reps: 8, weight: '60kg', targetMuscle: 'Back', restTime: '120s' },
    { id: '4', name: 'Shoulder Press', sets: 3, reps: 10, weight: '30kg', targetMuscle: 'Shoulders', restTime: '60s' },
    { id: '5', name: 'Pull-ups', sets: 3, reps: 8, weight: 'Body', targetMuscle: 'Back', restTime: '90s' },
    { id: '6', name: 'Lunges', sets: 3, reps: 12, weight: '20kg', targetMuscle: 'Legs', restTime: '60s' },
    { id: '7', name: 'Bicep Curls', sets: 3, reps: 12, weight: '15kg', targetMuscle: 'Arms', restTime: '60s' },
    { id: '8', name: 'Plank', sets: 3, reps: '30s', weight: 'Body', targetMuscle: 'Core', restTime: '45s' },
  ],
  duration: '45 min',
  difficulty: 'Intermediate',
  calories: '350-400',
};

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('exercises');
  
  // In a real app, we would fetch the workout details based on the ID
  const workout = MOCK_WORKOUT;
  
  const renderExerciseItem = (exercise, index) => (
    <View key={exercise.id} className="bg-card p-4 rounded-xl border border-border mb-3">
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
          <Text className="text-white font-bold">{index + 1}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-text">{exercise.name}</Text>
          <Text className="text-textSecondary">{exercise.targetMuscle}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-3 flex-wrap">
        <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
          <Text className="text-textSecondary">{exercise.sets} sets</Text>
        </View>
        <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
          <Text className="text-textSecondary">{exercise.reps} reps</Text>
        </View>
        <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
          <Text className="text-textSecondary">{exercise.weight}</Text>
        </View>
        <View className="bg-background px-3 py-1 rounded-full mb-2">
          <Text className="text-textSecondary">Rest: {exercise.restTime}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Workout Header */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-2xl font-bold text-text mb-2">{workout.name}</Text>
          <Text className="text-textSecondary mb-3">{workout.description}</Text>
          
          <View className="flex-row flex-wrap">
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-textSecondary">{workout.duration}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-textSecondary">{workout.difficulty}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mb-2">
              <Text className="text-textSecondary">{workout.calories} cal</Text>
            </View>
          </View>
        </View>
        
        {/* Tabs */}
        <View className="flex-row bg-card rounded-lg mb-4 p-1">
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'exercises' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('exercises')}
          >
            <Text className={`text-center ${activeTab === 'exercises' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Exercises
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'history' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('history')}
          >
            <Text className={`text-center ${activeTab === 'history' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Exercise List */}
        {activeTab === 'exercises' && (
          <View>
            {workout.exercises.map((exercise, index) => renderExerciseItem(exercise, index))}
          </View>
        )}
        
        {/* History Tab (placeholder) */}
        {activeTab === 'history' && (
          <View className="bg-card p-4 rounded-xl border border-border">
            <Text className="text-text text-center">No workout history available yet.</Text>
          </View>
        )}
      </View>
      
      {/* Start Workout Button */}
      <View className="px-4 pb-8 pt-2">
        <TouchableOpacity className="bg-primary py-3 rounded-full">
          <Text className="text-white font-semibold text-center">Start Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
