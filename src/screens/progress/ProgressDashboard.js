import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTracking } from '../../context/TrackingContext';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Get screen width for responsive charts
const screenWidth = Dimensions.get('window').width;

export default function ProgressDashboard() {
  const { completedWorkouts, fetchCompletedWorkouts, isLoading, error } = useTracking();
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [monthlyWorkouts, setMonthlyWorkouts] = useState([]);
  const [totalStats, setTotalStats] = useState({
    workouts: 0,
    duration: 0,
    sets: 0,
    weight: 0
  });
  const router = useRouter();

  useEffect(() => {
    fetchCompletedWorkouts();
  }, []);

  useEffect(() => {
    if (completedWorkouts && completedWorkouts.length > 0) {
      calculateStats();
    }
  }, [completedWorkouts]);

  const calculateStats = () => {
    // Calculate total stats
    const total = {
      workouts: completedWorkouts.length,
      duration: completedWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0),
      sets: completedWorkouts.reduce((sum, workout) => sum + (workout.total_sets || 0), 0),
      weight: completedWorkouts.reduce((sum, workout) => sum + (workout.total_weight || 0), 0)
    };
    setTotalStats(total);

    // Calculate weekly data (last 7 days)
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyData = Array(7).fill(0);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.unshift(dayLabels[date.getDay()]);
      
      // Count workouts for this day
      const dayWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date_completed || workout.created_at);
        return workoutDate.toDateString() === date.toDateString();
      });
      
      weeklyData[6-i] = dayWorkouts.length;
    }
    
    setWeeklyWorkouts({
      labels,
      datasets: [{ data: weeklyData }]
    });

    // Calculate monthly data (last 30 days grouped by week)
    const monthlyData = Array(4).fill(0);
    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i+1)*7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i*7);
      
      // Count workouts for this week
      const weekWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date_completed || workout.created_at);
        return workoutDate >= weekStart && workoutDate < weekEnd;
      });
      
      monthlyData[3-i] = weekWorkouts.length;
    }
    
    setMonthlyWorkouts({
      labels: weekLabels,
      datasets: [{ data: monthlyData }]
    });
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

  const handleViewHistory = () => {
    router.push('/progress/history');
  };

  if (isLoading && completedWorkouts.length === 0) {
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
          onPress={fetchCompletedWorkouts}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    color: (opacity = 1) => `rgba(93, 79, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-text text-2xl font-bold">Progress</Text>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={handleViewHistory}
          >
            <Text className="text-primary mr-1">View History</Text>
            <Ionicons name="chevron-forward" size={16} color="#5D4FEB" />
          </TouchableOpacity>
        </View>

        {completedWorkouts.length === 0 ? (
          <View className="bg-card p-6 rounded-xl border border-border items-center justify-center">
            <Ionicons name="fitness-outline" size={64} color="#5D4FEB" />
            <Text className="text-text text-lg font-semibold mt-4 mb-2">No Workouts Yet</Text>
            <Text className="text-textSecondary text-center mb-4">
              Complete your first workout to start tracking your progress
            </Text>
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-full"
              onPress={() => router.push('/workouts')}
            >
              <Text className="text-white font-semibold">Start a Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stats Overview */}
            <View className="mb-6">
              <Text className="text-text text-lg font-semibold mb-3">Stats Overview</Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 pr-2 mb-3">
                  <View className="bg-card p-4 rounded-xl border border-border">
                    <Text className="text-textSecondary mb-1">Total Workouts</Text>
                    <Text className="text-text text-2xl font-bold">{totalStats.workouts}</Text>
                  </View>
                </View>
                <View className="w-1/2 pl-2 mb-3">
                  <View className="bg-card p-4 rounded-xl border border-border">
                    <Text className="text-textSecondary mb-1">Total Time</Text>
                    <Text className="text-text text-2xl font-bold">{formatDuration(totalStats.duration)}</Text>
                  </View>
                </View>
                <View className="w-1/2 pr-2">
                  <View className="bg-card p-4 rounded-xl border border-border">
                    <Text className="text-textSecondary mb-1">Total Sets</Text>
                    <Text className="text-text text-2xl font-bold">{totalStats.sets}</Text>
                  </View>
                </View>
                <View className="w-1/2 pl-2">
                  <View className="bg-card p-4 rounded-xl border border-border">
                    <Text className="text-textSecondary mb-1">Total Weight</Text>
                    <Text className="text-text text-2xl font-bold">{totalStats.weight} kg</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Weekly Progress */}
            {weeklyWorkouts.datasets && (
              <View className="mb-6">
                <Text className="text-text text-lg font-semibold mb-3">Weekly Progress</Text>
                <View className="bg-card p-4 rounded-xl border border-border">
                  <Text className="text-textSecondary mb-3">Workouts Completed</Text>
                  <LineChart
                    data={weeklyWorkouts}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            )}

            {/* Monthly Progress */}
            {monthlyWorkouts.datasets && (
              <View className="mb-6">
                <Text className="text-text text-lg font-semibold mb-3">Monthly Progress</Text>
                <View className="bg-card p-4 rounded-xl border border-border">
                  <Text className="text-textSecondary mb-3">Workouts by Week</Text>
                  <LineChart
                    data={monthlyWorkouts}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </View>
              </View>
            )}

            {/* Recent Workouts */}
            <View className="mb-6">
              <Text className="text-text text-lg font-semibold mb-3">Recent Workouts</Text>
              {completedWorkouts.slice(0, 3).map(workout => (
                <TouchableOpacity
                  key={workout.id}
                  className="bg-card p-4 mb-3 rounded-xl border border-border"
                  onPress={() => router.push(`/progress/workout/${workout.id}`)}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-text font-semibold">{workout.workouts?.name || 'Workout'}</Text>
                    <Text className="text-textSecondary text-xs">
                      {new Date(workout.date_completed || workout.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <View className="bg-background px-3 py-1 rounded-full mr-2">
                      <Text className="text-textSecondary text-xs">{formatDuration(workout.duration || 0)}</Text>
                    </View>
                    <View className="bg-background px-3 py-1 rounded-full mr-2">
                      <Text className="text-textSecondary text-xs">{workout.total_sets || 0} sets</Text>
                    </View>
                    <View className="bg-background px-3 py-1 rounded-full">
                      <Text className="text-textSecondary text-xs">{workout.total_weight || 0} kg</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {completedWorkouts.length > 3 && (
                <TouchableOpacity
                  className="flex-row justify-center items-center mt-2"
                  onPress={handleViewHistory}
                >
                  <Text className="text-primary">View All Workouts</Text>
                  <Ionicons name="chevron-forward" size={16} color="#5D4FEB" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
