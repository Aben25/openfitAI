import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTracking } from '../../context/TrackingContext';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutHistory() {
  const { completedWorkouts, fetchCompletedWorkouts, isLoading, error } = useTracking();
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'week', 'month'
  const router = useRouter();

  useEffect(() => {
    fetchCompletedWorkouts();
  }, []);

  useEffect(() => {
    if (completedWorkouts) {
      filterWorkouts(activeFilter);
    }
  }, [completedWorkouts, activeFilter]);

  const filterWorkouts = (filter) => {
    const now = new Date();
    let filtered = [...completedWorkouts];
    
    if (filter === 'week') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.date_completed || workout.created_at);
        return workoutDate >= oneWeekAgo;
      });
    } else if (filter === 'month') {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.date_completed || workout.created_at);
        return workoutDate >= oneMonthAgo;
      });
    }
    
    setFilteredWorkouts(filtered);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleWorkoutPress = (workoutId) => {
    router.push(`/progress/workout/${workoutId}`);
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      className="bg-card p-4 mb-3 rounded-xl border border-border"
      onPress={() => handleWorkoutPress(item.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text font-semibold">{item.workouts?.name || 'Workout'}</Text>
        <Text className="text-textSecondary text-xs">
          {new Date(item.date_completed || item.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View className="flex-row mb-2">
        <View className="bg-background px-3 py-1 rounded-full mr-2">
          <Text className="text-textSecondary text-xs">{formatDuration(item.duration || 0)}</Text>
        </View>
        <View className="bg-background px-3 py-1 rounded-full mr-2">
          <Text className="text-textSecondary text-xs">{item.total_sets || 0} sets</Text>
        </View>
        <View className="bg-background px-3 py-1 rounded-full">
          <Text className="text-textSecondary text-xs">{item.total_weight || 0} kg</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-textSecondary text-xs">
          {item.total_reps || 0} total reps
        </Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => handleWorkoutPress(item.id)}
        >
          <Text className="text-primary mr-1">Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#5D4FEB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-6">Workout History</Text>
      
      <View className="flex-row mb-4">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeFilter === 'all' ? 'bg-primary' : 'bg-card border border-border'
          }`}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            className={`${
              activeFilter === 'all' ? 'text-white' : 'text-text'
            } font-medium`}
          >
            All Time
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${
            activeFilter === 'month' ? 'bg-primary' : 'bg-card border border-border'
          }`}
          onPress={() => setActiveFilter('month')}
        >
          <Text
            className={`${
              activeFilter === 'month' ? 'text-white' : 'text-text'
            } font-medium`}
          >
            This Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            activeFilter === 'week' ? 'bg-primary' : 'bg-card border border-border'
          }`}
          onPress={() => setActiveFilter('week')}
        >
          <Text
            className={`${
              activeFilter === 'week' ? 'text-white' : 'text-text'
            } font-medium`}
          >
            This Week
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && completedWorkouts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5D4FEB" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-error text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-full"
            onPress={fetchCompletedWorkouts}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredWorkouts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="fitness-outline" size={64} color="#5D4FEB" />
          <Text className="text-text text-lg font-semibold mt-4 mb-2">No Workouts Found</Text>
          <Text className="text-textSecondary text-center mb-4">
            {activeFilter === 'all' 
              ? "You haven't completed any workouts yet" 
              : `No workouts completed in this ${activeFilter === 'week' ? 'week' : 'month'}`}
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-full"
            onPress={() => router.push('/workouts')}
          >
            <Text className="text-white font-semibold">Start a Workout</Text>
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
