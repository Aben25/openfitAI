import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExercise } from '../../context/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams();
  const { fetchExerciseById, isLoading, error } = useExercise();
  const [exercise, setExercise] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadExercise();
    }
  }, [id]);

  const loadExercise = async () => {
    const data = await fetchExerciseById(id);
    if (data) {
      setExercise(data);
    }
  };

  if (isLoading && !exercise) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#5D4FEB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-error text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-full"
          onPress={loadExercise}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-textSecondary">Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-text text-2xl font-bold">{exercise.name}</Text>
          <View className="flex-row mt-2">
            <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
              <Text className="text-primary">{exercise.category}</Text>
            </View>
            {exercise.equipment && (
              <View className="bg-card px-3 py-1 rounded-full">
                <Text className="text-textSecondary">{exercise.equipment}</Text>
              </View>
            )}
          </View>
        </View>

        {exercise.video_url && (
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-2">Video Demonstration</Text>
            <View className="bg-card aspect-video rounded-xl border border-border items-center justify-center">
              {/* In a real implementation, this would be a video player */}
              <Ionicons name="play-circle" size={64} color="#5D4FEB" />
              <Text className="text-textSecondary mt-2">Video available</Text>
            </View>
          </View>
        )}

        {exercise.description && (
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-2">Description</Text>
            <View className="bg-card p-4 rounded-xl border border-border">
              <Text className="text-text">{exercise.description}</Text>
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-2">Muscles Worked</Text>
          <View className="bg-card p-4 rounded-xl border border-border">
            {exercise.primary_muscle && (
              <View className="mb-3">
                <Text className="text-textSecondary mb-1">Primary</Text>
                <View className="flex-row">
                  <View className="bg-primary/10 px-3 py-1 rounded-full">
                    <Text className="text-primary">{exercise.primary_muscle}</Text>
                  </View>
                </View>
              </View>
            )}
            
            {exercise.secondary_muscle && (
              <View>
                <Text className="text-textSecondary mb-1">Secondary</Text>
                <View className="flex-row">
                  <View className="bg-background px-3 py-1 rounded-full">
                    <Text className="text-textSecondary">{exercise.secondary_muscle}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-2">Instructions</Text>
          <View className="bg-card p-4 rounded-xl border border-border">
            {exercise.instructions ? (
              <Text className="text-text">{exercise.instructions}</Text>
            ) : (
              <Text className="text-textSecondary">No instructions available</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary py-3 rounded-full mb-6"
          onPress={() => router.push('/workouts/create')}
        >
          <Text className="text-white font-semibold text-center">Add to Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
