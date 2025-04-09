import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useWorkout } from '../../src/context/WorkoutContext';

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { createNewWorkout, fetchExercises, isLoading } = useWorkout();
  
  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [category, setCategory] = useState('strength');
  const [estimatedDuration, setEstimatedDuration] = useState('45');
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  const difficultyOptions = ['beginner', 'intermediate', 'advanced'];
  const categoryOptions = ['strength', 'cardio', 'flexibility', 'hiit', 'recovery'];
  
  // Validate form
  const validateForm = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return false;
    }
    
    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise to your workout');
      return false;
    }
    
    return true;
  };
  
  // Handle save workout
  const handleSaveWorkout = async () => {
    if (!validateForm()) return;
    
    try {
      // Create workout data object
      const workoutData = {
        name: workoutName,
        description: description,
        difficulty: difficulty,
        category: category,
        estimated_duration: parseInt(estimatedDuration),
      };
      
      // Create the workout
      const newWorkout = await createNewWorkout(workoutData);
      
      if (!newWorkout) {
        throw new Error('Failed to create workout');
      }
      
      // Navigate to the workout detail screen
      router.replace(`/workouts/${newWorkout.id}`);
      
      // Show success message
      Alert.alert('Success', 'Workout created successfully');
    } catch (error) {
      console.error('Error creating workout:', error);
      Alert.alert('Error', 'Failed to create workout. Please try again.');
    }
  };
  
  // Handle add exercise
  const handleAddExercise = () => {
    // Navigate to exercise selection screen
    router.push('/exercises?select=true');
  };
  
  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Create Workout' }} />
      
      <View className="p-4">
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Workout Details</Text>
          
          {/* Workout Name Input */}
          <View className="mb-4">
            <Text className="text-textSecondary mb-1">Workout Name*</Text>
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
          
          {/* Category Selection */}
          <View className="mb-4">
            <Text className="text-textSecondary mb-2">Category</Text>
            <View className="flex-row flex-wrap">
              {categoryOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    category === option ? 'bg-primary' : 'bg-background border border-border'
                  }`}
                  onPress={() => setCategory(option)}
                >
                  <Text
                    className={`${
                      category === option ? 'text-white' : 'text-textSecondary'
                    } capitalize`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Difficulty Selection */}
          <View className="mb-4">
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
          
          {/* Estimated Duration */}
          <View className="mb-4">
            <Text className="text-textSecondary mb-1">Estimated Duration (minutes)</Text>
            <TextInput
              className="bg-background text-text p-3 rounded-lg border border-border"
              placeholder="Enter estimated duration"
              placeholderTextColor="#757575"
              value={estimatedDuration}
              onChangeText={setEstimatedDuration}
              keyboardType="number-pad"
            />
          </View>
        </View>
        
        {/* Exercise Selection Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Exercises</Text>
          <Text className="text-textSecondary mb-4">Add exercises to your workout</Text>
          
          {/* Selected Exercises List */}
          {selectedExercises.length > 0 ? (
            <View className="mb-4">
              {selectedExercises.map((exercise, index) => (
                <View key={exercise.id} className="bg-background p-3 rounded-lg mb-2 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-text font-medium">{exercise.name}</Text>
                    <Text className="text-textSecondary text-xs">{exercise.sets} sets × {exercise.reps} reps</Text>
                  </View>
                  <TouchableOpacity 
                    className="bg-error/10 p-2 rounded-full"
                    onPress={() => {
                      setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
                    }}
                  >
                    <Text className="text-error">Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-background p-4 rounded-lg mb-4 items-center">
              <Text className="text-textSecondary">No exercises added yet</Text>
            </View>
          )}
          
          {/* Add Exercise Button */}
          <TouchableOpacity 
            className="bg-background border border-border p-3 rounded-lg flex-row items-center justify-center"
            onPress={handleAddExercise}
          >
            <Text className="text-primary font-semibold">+ Add Exercise</Text>
          </TouchableOpacity>
        </View>
        
        {/* Save Button */}
        <View className="mt-4 mb-8">
          <TouchableOpacity 
            className={`py-3 rounded-full ${isLoading ? 'bg-primary/50' : 'bg-primary'}`}
            onPress={handleSaveWorkout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-center">Save Workout</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
