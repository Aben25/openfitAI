import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';
import { useTracking } from '../../context/TrackingContext';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams();
  const { fetchWorkoutById, isLoading: workoutLoading, error: workoutError } = useWorkout();
  const { startWorkoutSession, isLoading: trackingLoading } = useTracking();
  const [workout, setWorkout] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadWorkout();
    }
  }, [id]);

  const loadWorkout = async () => {
    const data = await fetchWorkoutById(id);
    if (data) {
      setWorkout(data);
    }
  };

  const handleStartWorkout = async () => {
    const activeWorkout = await startWorkoutSession(id);
    if (activeWorkout) {
      router.push('/workouts/active');
    }
  };

  const handleEditWorkout = () => {
    router.push(`/workouts/edit/${id}`);
  };

  const isLoading = workoutLoading || trackingLoading;

  if (isLoading && !workout) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#5D4FEB" />
      </View>
    );
  }

  if (workoutError) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-error text-center mb-4">{workoutError}</Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-full"
          onPress={loadWorkout}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!workout) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-textSecondary">Workout not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-text text-2xl font-bold">{workout.name}</Text>
            {workout.description && (
              <Text className="text-textSecondary mt-2">{workout.description}</Text>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-3">Exercises</Text>
            {workout.workout_exercises && workout.workout_exercises.length > 0 ? (
              workout.workout_exercises.map((workoutExercise, index) => (
                <View 
                  key={workoutExercise.id} 
                  className="bg-card p-4 mb-3 rounded-xl border border-border"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                      <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold">{index + 1}</Text>
                      </View>
                      <Text className="text-text font-semibold">{workoutExercise.exercises.name}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row mt-2">
                    <View className="bg-background px-3 py-1 rounded-full mr-2">
                      <Text className="text-textSecondary text-xs">{workoutExercise.sets} sets</Text>
                    </View>
                    <View className="bg-background px-3 py-1 rounded-full mr-2">
                      <Text className="text-textSecondary text-xs">{workoutExercise.reps} reps</Text>
                    </View>
                    <View className="bg-background px-3 py-1 rounded-full">
                      <Text className="text-textSecondary text-xs">{workoutExercise.rest_interval}s rest</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-textSecondary">No exercises in this workout</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View className="p-4 border-t border-border bg-card">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 bg-primary py-3 rounded-full mr-2"
            onPress={handleStartWorkout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="flex-row justify-center items-center">
                <Ionicons name="play" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">Start Workout</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-card py-3 px-4 rounded-full border border-border"
            onPress={handleEditWorkout}
          >
            <Ionicons name="pencil" size={20} color="#5D4FEB" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
