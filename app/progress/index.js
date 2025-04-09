import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

// Mock data for progress dashboard
const MOCK_STATS = {
  workoutsCompleted: 24,
  totalExercises: 156,
  totalSets: 468,
  totalWeight: '12,450 kg',
  streakDays: 5,
  weightProgress: {
    current: '78.5 kg',
    change: '-2.3 kg',
    isPositive: true
  },
  recentWorkouts: [
    { id: '1', name: 'Full Body Strength', date: 'Today', duration: '45 min' },
    { id: '2', name: 'Upper Body Focus', date: '2 days ago', duration: '30 min' },
    { id: '3', name: 'Cardio Blast', date: '4 days ago', duration: '20 min' },
  ]
};

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState('month');
  
  const renderStatCard = (title, value, subtitle = null) => (
    <View className="bg-card p-4 rounded-xl border border-border flex-1 min-w-[45%] m-1">
      <Text className="text-textSecondary text-sm mb-1">{title}</Text>
      <Text className="text-text text-xl font-bold">{value}</Text>
      {subtitle && <Text className="text-textSecondary text-xs mt-1">{subtitle}</Text>}
    </View>
  );
  
  const renderWorkoutItem = (workout) => (
    <Link href={`/workouts/${workout.id}`} key={workout.id} asChild>
      <TouchableOpacity>
        <View className="bg-card p-3 rounded-xl border border-border mb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-text font-semibold">{workout.name}</Text>
            <Text className="text-textSecondary text-xs">{workout.date}</Text>
          </View>
          <Text className="text-textSecondary">{workout.duration}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Time Range Selector */}
        <View className="flex-row bg-card rounded-lg mb-4 p-1">
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${timeRange === 'week' ? 'bg-primary' : ''}`}
            onPress={() => setTimeRange('week')}
          >
            <Text className={`text-center ${timeRange === 'week' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${timeRange === 'month' ? 'bg-primary' : ''}`}
            onPress={() => setTimeRange('month')}
          >
            <Text className={`text-center ${timeRange === 'month' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${timeRange === 'year' ? 'bg-primary' : ''}`}
            onPress={() => setTimeRange('year')}
          >
            <Text className={`text-center ${timeRange === 'year' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Year
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Summary Stats */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Summary</Text>
          <View className="flex-row flex-wrap">
            {renderStatCard('Workouts', MOCK_STATS.workoutsCompleted)}
            {renderStatCard('Exercises', MOCK_STATS.totalExercises)}
            {renderStatCard('Total Sets', MOCK_STATS.totalSets)}
            {renderStatCard('Weight Lifted', MOCK_STATS.totalWeight)}
          </View>
        </View>
        
        {/* Streak Card */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Current Streak</Text>
          <View className="flex-row items-center">
            <Text className="text-primary text-3xl font-bold mr-2">{MOCK_STATS.streakDays}</Text>
            <Text className="text-textSecondary">days in a row</Text>
          </View>
          <Text className="text-textSecondary text-xs mt-2">Keep it up! You're building a great habit.</Text>
        </View>
        
        {/* Weight Progress */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-text">Weight Progress</Text>
            <Link href="/progress/weight-history" asChild>
              <TouchableOpacity>
                <Text className="text-primary">View All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-text text-2xl font-bold">{MOCK_STATS.weightProgress.current}</Text>
              <Text className="text-textSecondary text-xs">Current Weight</Text>
            </View>
            <View className="items-end">
              <Text className={`text-xl font-bold ${MOCK_STATS.weightProgress.isPositive ? 'text-success' : 'text-error'}`}>
                {MOCK_STATS.weightProgress.change}
              </Text>
              <Text className="text-textSecondary text-xs">This {timeRange}</Text>
            </View>
          </View>
          
          {/* Chart Placeholder */}
          <View className="h-32 bg-background rounded-lg mt-3 items-center justify-center">
            <Text className="text-textSecondary">Weight chart will appear here</Text>
          </View>
          
          <TouchableOpacity className="bg-background border border-border p-2 rounded-lg mt-3 items-center">
            <Text className="text-primary">Log Weight</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Workouts */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-text">Recent Workouts</Text>
            <Link href="/progress/workout-history" asChild>
              <TouchableOpacity>
                <Text className="text-primary">View All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {MOCK_STATS.recentWorkouts.map(workout => renderWorkoutItem(workout))}
        </View>
        
        {/* Personal Records Placeholder */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Personal Records</Text>
          <Text className="text-textSecondary text-center py-4">Complete more workouts to see your personal records.</Text>
        </View>
      </View>
    </ScrollView>
  );
}
