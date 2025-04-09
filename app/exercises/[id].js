import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

// Mock data for exercise details
const MOCK_EXERCISES = {
  '1': {
    id: '1',
    name: 'Squats',
    targetMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Calves'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'The squat is a compound exercise that primarily targets the quadriceps, hamstrings, and glutes. It also engages the lower back, calves, and core as stabilizing muscles.',
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly turned out.',
      'Keep chest up and back straight throughout the movement.',
      'Bend at the knees and hips to lower your body as if sitting in a chair.',
      'Lower until thighs are parallel to the ground or slightly below.',
      'Push through your heels to return to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your knees in line with your toes.',
      'Maintain a neutral spine throughout the movement.',
      'Breathe in as you lower and out as you rise.',
      'Start with bodyweight before adding resistance.'
    ],
    variations: ['Front Squat', 'Goblet Squat', 'Sumo Squat', 'Bulgarian Split Squat'],
    personalBest: {
      weight: '100kg',
      reps: 8,
      date: '2025-03-15'
    }
  }
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, we would fetch the exercise details based on the ID
  const exercise = MOCK_EXERCISES[id] || MOCK_EXERCISES['1'];
  
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Exercise Header */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-2xl font-bold text-text mb-2">{exercise.name}</Text>
          
          <View className="flex-row flex-wrap mb-3">
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-textSecondary">{exercise.targetMuscle}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-textSecondary">{exercise.equipment}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mb-2">
              <Text className="text-textSecondary">{exercise.difficulty}</Text>
            </View>
          </View>
          
          <Text className="text-textSecondary">{exercise.description}</Text>
        </View>
        
        {/* Tabs */}
        <View className="flex-row bg-card rounded-lg mb-4 p-1">
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'overview' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('overview')}
          >
            <Text className={`text-center ${activeTab === 'overview' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Overview
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
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <View>
            {/* Instructions */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Instructions</Text>
              {exercise.instructions.map((instruction, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-primary font-bold mr-2">{index + 1}.</Text>
                  <Text className="text-textSecondary flex-1">{instruction}</Text>
                </View>
              ))}
            </View>
            
            {/* Tips */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Tips</Text>
              {exercise.tips.map((tip, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-secondary mr-2">•</Text>
                  <Text className="text-textSecondary flex-1">{tip}</Text>
                </View>
              ))}
            </View>
            
            {/* Variations */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Variations</Text>
              <View className="flex-row flex-wrap">
                {exercise.variations.map((variation, index) => (
                  <View key={index} className="bg-background px-3 py-2 rounded-full mr-2 mb-2">
                    <Text className="text-textSecondary">{variation}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Muscles Worked */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Muscles Worked</Text>
              <View className="mb-2">
                <Text className="text-textSecondary font-semibold mb-1">Primary:</Text>
                <Text className="text-text">{exercise.targetMuscle}</Text>
              </View>
              <View>
                <Text className="text-textSecondary font-semibold mb-1">Secondary:</Text>
                <Text className="text-text">{exercise.secondaryMuscles.join(', ')}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <View>
            {/* Personal Best */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Personal Best</Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-primary text-xl font-bold">{exercise.personalBest.weight}</Text>
                  <Text className="text-textSecondary">Weight</Text>
                </View>
                <View className="items-center">
                  <Text className="text-primary text-xl font-bold">{exercise.personalBest.reps}</Text>
                  <Text className="text-textSecondary">Reps</Text>
                </View>
                <View className="items-center">
                  <Text className="text-primary text-xl font-bold">{exercise.personalBest.date}</Text>
                  <Text className="text-textSecondary">Date</Text>
                </View>
              </View>
            </View>
            
            {/* Recent Sets */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Recent Sets</Text>
              <Text className="text-textSecondary text-center">No recent sets recorded.</Text>
            </View>
            
            {/* Progress Chart Placeholder */}
            <View className="bg-card p-4 rounded-xl border border-border mb-4">
              <Text className="text-lg font-semibold text-text mb-3">Progress Chart</Text>
              <View className="h-40 bg-background rounded-lg items-center justify-center">
                <Text className="text-textSecondary">Progress chart will appear here</Text>
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* Add to Workout Button */}
      <View className="px-4 pb-8 pt-2">
        <TouchableOpacity className="bg-primary py-3 rounded-full">
          <Text className="text-white font-semibold text-center">Add to Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
