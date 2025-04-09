import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutList() {
  const { workouts, isLoading, error, fetchWorkouts } = useWorkout();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (workouts) {
      if (searchQuery.trim() === '') {
        setFilteredWorkouts(workouts);
      } else {
        const filtered = workouts.filter(workout => 
          workout.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredWorkouts(filtered);
      }
    }
  }, [workouts, searchQuery]);

  const handleCreateWorkout = () => {
    router.push('/workouts/create');
  };

  const handleWorkoutPress = (workoutId) => {
    router.push(`/workouts/${workoutId}`);
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      className="bg-card p-4 mb-3 rounded-xl border border-border"
      onPress={() => handleWorkoutPress(item.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text text-lg font-semibold">{item.name}</Text>
        <View className="bg-primary/10 px-3 py-1 rounded-full">
          <Text className="text-primary text-xs">
            {item.workout_exercises?.length || 0} exercises
          </Text>
        </View>
      </View>
      
      {item.description && (
        <Text className="text-textSecondary mb-2" numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View className="flex-row justify-between items-center">
        <Text className="text-textSecondary text-xs">
          Created {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => handleWorkoutPress(item.id)}
        >
          <Text className="text-primary mr-1">View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#5D4FEB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-text text-2xl font-bold">My Workouts</Text>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-full"
          onPress={handleCreateWorkout}
        >
          <Text className="text-white font-semibold">Create</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center bg-card border border-border rounded-lg px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#757575" />
        <TextInput
          className="flex-1 ml-2 text-text"
          placeholder="Search workouts..."
          placeholderTextColor="#757575"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
      
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5D4FEB" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-error text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-full"
            onPress={fetchWorkouts}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredWorkouts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="fitness-outline" size={64} color="#5D4FEB" />
          <Text className="text-textSecondary text-center mt-4 mb-6">
            {searchQuery.trim() !== '' 
              ? "No workouts match your search" 
              : "You haven't created any workouts yet"}
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-full"
            onPress={handleCreateWorkout}
          >
            <Text className="text-white font-semibold">Create Your First Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-20"
        />
      )}
    </View>
  );
}
