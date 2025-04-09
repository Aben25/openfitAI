import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useWorkout } from '../../src/context/WorkoutContext';

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { 
    fetchWorkoutById, 
    completeWorkoutSession, 
    logCompletedSet,
    isLoading 
  } = useWorkout();
  
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  
  // Fetch workout details
  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      
      try {
        const workoutData = await fetchWorkoutById(id);
        if (workoutData) {
          setWorkout(workoutData);
          
          // Initialize completed sets tracking
          const initialCompletedSets = {};
          workoutData.workout_exercises.forEach(exercise => {
            initialCompletedSets[exercise.id] = Array(exercise.sets).fill().map(() => ({
              reps: exercise.reps.toString(),
              weight: exercise.weight || '',
              completed: false
            }));
          });
          setCompletedSets(initialCompletedSets);
          
          // Set session start time
          setSessionStartTime(new Date());
        }
      } catch (error) {
        console.error('Error loading workout session:', error);
        Alert.alert('Error', 'Failed to load workout session');
      }
    };
    
    loadWorkout();
    
    // Start the workout timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [id]);
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle set completion
  const handleSetCompletion = async (exerciseId, setIndex) => {
    try {
      // Update local state
      const updatedSets = {...completedSets};
      updatedSets[exerciseId][setIndex].completed = true;
      setCompletedSets(updatedSets);
      
      // Get the current exercise
      const exercise = workout.workout_exercises.find(ex => ex.id === exerciseId);
      
      // Log the completed set to the database
      await logCompletedSet({
        completed_workout_id: id,
        exercise_id: exercise.exercise_id,
        set_number: setIndex + 1,
        reps: parseInt(updatedSets[exerciseId][setIndex].reps),
        weight: updatedSets[exerciseId][setIndex].weight || null,
        completed_at: new Date().toISOString()
      });
      
      // Start rest timer if not the last set
      const isLastSet = setIndex === exercise.sets - 1;
      const isLastExercise = currentExerciseIndex === workout.workout_exercises.length - 1;
      
      if (!isLastSet || !isLastExercise) {
        startRestTimer(exercise.rest_time || 60);
      }
      
      // Move to next exercise if all sets are completed
      const allSetsCompleted = updatedSets[exerciseId].every(set => set.completed);
      if (allSetsCompleted && !isLastExercise) {
        // Wait for rest timer to finish before moving to next exercise
        setTimeout(() => {
          setCurrentExerciseIndex(prev => prev + 1);
        }, (exercise.rest_time || 60) * 1000);
      }
    } catch (error) {
      console.error('Error completing set:', error);
      Alert.alert('Error', 'Failed to log completed set');
    }
  };
  
  // Start rest timer
  const startRestTimer = (seconds) => {
    setIsRestTimerActive(true);
    setRestTimeRemaining(seconds);
    
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    
    restTimerRef.current = setInterval(() => {
      setRestTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current);
          setIsRestTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Skip rest timer
  const skipRestTimer = () => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setIsRestTimerActive(false);
    setRestTimeRemaining(0);
  };
  
  // Handle workout completion
  const handleCompleteWorkout = async () => {
    // Confirm completion
    Alert.alert(
      'Complete Workout',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: async () => {
            setIsCompleting(true);
            try {
              // Calculate duration in minutes
              const durationInSeconds = elapsedTime;
              const durationInMinutes = Math.ceil(durationInSeconds / 60);
              
              // Complete the workout
              await completeWorkoutSession(id, {
                duration_minutes: durationInMinutes
              });
              
              // Navigate back to workouts
              router.replace('/workouts');
              
              // Show success message
              Alert.alert('Success', 'Workout completed successfully!');
            } catch (error) {
              console.error('Error completing workout:', error);
              Alert.alert('Error', 'Failed to complete workout');
            } finally {
              setIsCompleting(false);
            }
          }
        }
      ]
    );
  };
  
  // Update set details
  const updateSetDetail = (exerciseId, setIndex, field, value) => {
    const updatedSets = {...completedSets};
    updatedSets[exerciseId][setIndex][field] = value;
    setCompletedSets(updatedSets);
  };
  
  // Loading state
  if (isLoading && !workout) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-textSecondary mt-4">Loading workout session...</Text>
      </View>
    );
  }
  
  // No workout found
  if (!workout) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-4">
        <Text className="text-textSecondary mb-4">Workout session not found</Text>
        <TouchableOpacity 
          className="bg-primary py-2 px-4 rounded-lg"
          onPress={() => router.replace('/workouts')}
        >
          <Text className="text-white">Back to Workouts</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Get current exercise
  const currentExercise = workout.workout_exercises[currentExerciseIndex];
  const exerciseData = currentExercise.exercises;
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen 
        options={{
          title: workout.name,
          headerRight: () => (
            <Text className="text-primary font-semibold">{formatTime(elapsedTime)}</Text>
          )
        }}
      />
      
      {/* Rest Timer Overlay */}
      {isRestTimerActive && (
        <View className="absolute inset-0 bg-black/70 z-10 justify-center items-center">
          <Text className="text-white text-4xl font-bold mb-4">{restTimeRemaining}</Text>
          <Text className="text-white text-xl mb-8">Rest Time</Text>
          <TouchableOpacity 
            className="bg-primary py-3 px-6 rounded-full"
            onPress={skipRestTimer}
          >
            <Text className="text-white font-semibold">Skip Rest</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView className="flex-1 p-4">
        {/* Exercise Header */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold">{currentExerciseIndex + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-text">{exerciseData.name}</Text>
              <Text className="text-textSecondary">{exerciseData.primary_muscle}</Text>
            </View>
          </View>
          
          {exerciseData.instructions && (
            <View className="mt-2 bg-background p-3 rounded-lg">
              <Text className="text-textSecondary">{exerciseData.instructions}</Text>
            </View>
          )}
        </View>
        
        {/* Sets Tracking */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-4">Sets</Text>
          
          {/* Set Headers */}
          <View className="flex-row mb-2 px-2">
            <Text className="flex-1 text-textSecondary font-medium">Set</Text>
            <Text className="w-20 text-textSecondary font-medium text-center">Reps</Text>
            <Text className="w-20 text-textSecondary font-medium text-center">Weight</Text>
            <Text className="w-24 text-textSecondary font-medium text-center">Status</Text>
          </View>
          
          {/* Sets */}
          {completedSets[currentExercise.id]?.map((set, index) => (
            <View key={index} className="flex-row items-center mb-3 bg-background p-3 rounded-lg">
              <Text className="flex-1 text-text font-medium">Set {index + 1}</Text>
              
              <TextInput
                className="w-20 bg-card border border-border rounded-md p-2 text-center text-text"
                value={set.reps}
                onChangeText={(value) => updateSetDetail(currentExercise.id, index, 'reps', value)}
                keyboardType="number-pad"
                editable={!set.completed}
              />
              
              <TextInput
                className="w-20 bg-card border border-border rounded-md p-2 mx-2 text-center text-text"
                value={set.weight}
                onChangeText={(value) => updateSetDetail(currentExercise.id, index, 'weight', value)}
                placeholder="kg/lb"
                placeholderTextColor="#757575"
                keyboardType="numeric"
                editable={!set.completed}
              />
              
              {set.completed ? (
                <View className="w-24 bg-success/20 py-2 rounded-md items-center">
                  <Text className="text-success font-medium">Completed</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  className="w-24 bg-primary py-2 rounded-md items-center"
                  onPress={() => handleSetCompletion(currentExercise.id, index)}
                >
                  <Text className="text-white font-medium">Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        
        {/* Exercise Navigation */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity 
            className={`bg-card py-2 px-4 rounded-lg ${currentExerciseIndex === 0 ? 'opacity-50' : ''}`}
            onPress={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
            disabled={currentExerciseIndex === 0}
          >
            <Text className="text-primary font-medium">Previous</Text>
          </TouchableOpacity>
          
          <Text className="text-textSecondary self-center">
            {currentExerciseIndex + 1} of {workout.workout_exercises.length}
          </Text>
          
          <TouchableOpacity 
            className={`bg-card py-2 px-4 rounded-lg ${currentExerciseIndex === workout.workout_exercises.length - 1 ? 'opacity-50' : ''}`}
            onPress={() => setCurrentExerciseIndex(prev => Math.min(workout.workout_exercises.length - 1, prev + 1))}
            disabled={currentExerciseIndex === workout.workout_exercises.length - 1}
          >
            <Text className="text-primary font-medium">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Complete Workout Button */}
      <View className="p-4 bg-background border-t border-border">
        <TouchableOpacity 
          className={`py-3 rounded-full ${isCompleting ? 'bg-primary/50' : 'bg-primary'}`}
          onPress={handleCompleteWorkout}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center">Complete Workout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
