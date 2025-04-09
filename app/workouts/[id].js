import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { useWorkout } from '../../src/context/WorkoutContext';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    fetchWorkoutById, 
    deleteExistingWorkout, 
    startWorkoutSession,
    isLoading, 
    error 
  } = useWorkout();
  
  const [workout, setWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState('exercises');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch workout details
  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      
      try {
        const workoutData = await fetchWorkoutById(id);
        if (workoutData) {
          setWorkout(workoutData);
        }
      } catch (error) {
        console.error('Error loading workout:', error);
        Alert.alert('Error', 'Failed to load workout details');
      }
    };
    
    loadWorkout();
  }, [id]);
  
  // Handle start workout
  const handleStartWorkout = async () => {
    if (!workout) return;
    
    try {
      const session = await startWorkoutSession(workout.id);
      if (session) {
        // Navigate to workout session screen
        router.push(`/workout-session/${session.id}`);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start workout session');
    }
  };
  
  // Handle delete workout
  const handleDeleteWorkout = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await deleteExistingWorkout(workout.id);
              if (success) {
                router.replace('/workouts');
              } else {
                throw new Error('Failed to delete workout');
              }
            } catch (error) {
              console.error('Error deleting workout:', error);
              Alert.alert('Error', 'Failed to delete workout');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
  
  // Handle edit workout
  const handleEditWorkout = () => {
    router.push(`/workouts/edit/${workout.id}`);
  };
  
  const renderExerciseItem = (exercise, index) => {
    // Get the exercise data from the workout_exercise relationship
    const exerciseData = exercise.exercises;
    
    return (
      <View key={exercise.id} className="bg-card p-4 rounded-xl border border-border mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold">{index + 1}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-text">{exerciseData.name}</Text>
            <Text className="text-textSecondary">{exerciseData.primary_muscle}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between mt-3 flex-wrap">
          <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
            <Text className="text-textSecondary">{exercise.sets} sets</Text>
          </View>
          <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
            <Text className="text-textSecondary">{exercise.reps} reps</Text>
          </View>
          {exercise.weight && (
            <View className="bg-background px-3 py-1 rounded-full mb-2 mr-2">
              <Text className="text-textSecondary">{exercise.weight}</Text>
            </View>
          )}
          {exercise.rest_time && (
            <View className="bg-background px-3 py-1 rounded-full mb-2">
              <Text className="text-textSecondary">Rest: {exercise.rest_time}s</Text>
            </View>
          )}
        </View>
        
        {exerciseData.instructions && (
          <View className="mt-2 bg-background p-2 rounded-lg">
            <Text className="text-textSecondary text-xs">{exerciseData.instructions}</Text>
          </View>
        )}
      </View>
    );
  };

  // Loading state
  if (isLoading && !workout) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-textSecondary mt-4">Loading workout details...</Text>
      </View>
    );
  }
  
  // Error state
  if (error && !workout) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-error mb-4">Failed to load workout details</Text>
        <TouchableOpacity 
          className="bg-primary py-2 px-4 rounded-lg"
          onPress={() => fetchWorkoutById(id)}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // No workout found
  if (!workout) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-textSecondary mb-4">Workout not found</Text>
        <TouchableOpacity 
          className="bg-primary py-2 px-4 rounded-lg"
          onPress={() => router.replace('/workouts')}
        >
          <Text className="text-white">Back to Workouts</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen 
        options={{
          title: workout.name,
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity 
                className="mr-4"
                onPress={handleEditWorkout}
                disabled={isDeleting}
              >
                <Text className="text-primary">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteWorkout}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Text className="text-error">Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          )
        }}
      />
      
      <View className="p-4">
        {/* Workout Header */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-2xl font-bold text-text mb-2">{workout.name}</Text>
          
          {workout.category && (
            <View className="bg-primary/20 self-start px-2 py-1 rounded-md mb-2">
              <Text className="text-xs text-primary font-medium capitalize">{workout.category}</Text>
            </View>
          )}
          
          {workout.description && (
            <Text className="text-textSecondary mb-3">{workout.description}</Text>
          )}
          
          <View className="flex-row flex-wrap">
            {workout.estimated_duration && (
              <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-textSecondary">{workout.estimated_duration} min</Text>
              </View>
            )}
            {workout.difficulty && (
              <View className="bg-background px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-textSecondary capitalize">{workout.difficulty}</Text>
              </View>
            )}
            {workout.workout_exercises && (
              <View className="bg-background px-3 py-1 rounded-full mb-2">
                <Text className="text-textSecondary">{workout.workout_exercises.length} exercises</Text>
              </View>
            )}
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
            {workout.workout_exercises && workout.workout_exercises.length > 0 ? (
              workout.workout_exercises.map((exercise, index) => renderExerciseItem(exercise, index))
            ) : (
              <View className="bg-card p-4 rounded-xl border border-border">
                <Text className="text-text text-center">No exercises in this workout.</Text>
              </View>
            )}
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
        <TouchableOpacity 
          className={`py-3 rounded-full ${isLoading ? 'bg-primary/50' : 'bg-primary'}`}
          onPress={handleStartWorkout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center">Start Workout</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
