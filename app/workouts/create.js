import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function CreateWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  
  const difficultyOptions = ['beginner', 'intermediate', 'advanced'];
  
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Workout Details</Text>
          
          {/* Workout Name Input */}
          <View className="mb-4">
            <Text className="text-textSecondary mb-1">Workout Name</Text>
            <TextInput
              className="bg-background text-text p-3 rounded-lg border border-border"
              placeholder="Enter workout name"
              placeholderTextColor="#757575"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>
          
          {/* Description Input */}
          <View className="mb-4">
            <Text className="text-textSecondary mb-1">Description</Text>
            <TextInput
              className="bg-background text-text p-3 rounded-lg border border-border"
              placeholder="Enter workout description"
              placeholderTextColor="#757575"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              style={{ height: 100 }}
            />
          </View>
          
          {/* Difficulty Selection */}
          <View>
            <Text className="text-textSecondary mb-2">Difficulty Level</Text>
            <View className="flex-row">
              {difficultyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`mr-2 px-4 py-2 rounded-full ${
                    difficulty === option ? 'bg-primary' : 'bg-background border border-border'
                  }`}
                  onPress={() => setDifficulty(option)}
                >
                  <Text
                    className={`${
                      difficulty === option ? 'text-white' : 'text-textSecondary'
                    } capitalize`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Exercise Selection Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Exercises</Text>
          <Text className="text-textSecondary mb-4">Add exercises to your workout</Text>
          
          {/* Add Exercise Button */}
          <TouchableOpacity className="bg-background border border-border p-3 rounded-lg flex-row items-center justify-center">
            <Text className="text-primary font-semibold">+ Add Exercise</Text>
          </TouchableOpacity>
        </View>
        
        {/* Save Button */}
        <View className="mt-4 mb-8">
          <TouchableOpacity className="bg-primary py-3 rounded-full">
            <Text className="text-white font-semibold text-center">Save Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
