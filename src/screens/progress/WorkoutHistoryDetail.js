import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTracking } from '../../context/TrackingContext';
import { useWorkout } from '../../context/WorkoutContext';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Get screen width for responsive charts
const screenWidth = Dimensions.get('window').width;

export default function WorkoutHistoryDetail() {
  const { id } = useLocalSearchParams();
  const { fetchCompletedWorkoutById, isLoading: trackingLoading, error: trackingError } = useTracking();
  const { fetchWorkoutById, isLoading: workoutLoading, error: workoutError } = useWorkout();
  const [completedWorkout, setCompletedWorkout] = useState(null);
  const [workoutTemplate, setWorkoutTemplate] = useState(null);
  const [exerciseData, setExerciseData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadCompletedWorkout();
    }
  }, [id]);

  const loadCompletedWorkout = async () => {
    const data = await fetchCompletedWorkoutById(id);
    if (data) {
      setCompletedWorkout(data);
      
      // Load the workout template
      if (data.workout_id) {
        const template = await fetchWorkoutById(data.workout_id);
        if (template) {
          setWorkoutTemplate(template);
        }
      }
      
      // Process exercise data for charts
      if (data.performed_sets && data.performed_sets.length > 0) {
        processExerciseData(data.performed_sets);
      }
    }
  };

  const processExerciseData = (sets) => {
    // Group sets by exercise
    const exerciseMap = {};
    
    sets.forEach(set => {
      const exerciseId = set.workout_exercise_id;
      if (!exerciseMap[exerciseId]) {
        exerciseMap[exerciseId] = {
          exerciseId,
          exerciseName: set.workout_exercises?.exercises?.name || 'Exercise',
          sets: []
        };
      }
      
      exerciseMap[exerciseId].sets.push({
        setNumber: set.set_number,
        weight: set.weight,
        reps: set.reps
      });
    });
    
    // Convert to array and sort sets by set number
    const exerciseArray = Object.values(exerciseMap);
    exerciseArray.forEach(exercise => {
      exercise.sets.sort((a, b) => a.setNumber - b.setNumber);
    });
    
    setExerciseData(exerciseArray);
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

  const isLoading = trackingLoading || workoutLoading;
  const error = trackingError || workoutError;

  if (isLoading && !completedWorkout) {
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
          onPress={loadCompletedWorkout}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!completedWorkout) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-textSecondary">Workout not found</Text>
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
        <View className="mb-6">
          <Text className="text-text text-2xl font-bold">
            {workoutTemplate?.name || 'Workout'}
          </Text>
          <Text className="text-textSecondary">
            {new Date(completedWorkout.date_completed || completedWorkout.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Workout Summary */}
        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">Workout Summary</Text>
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-2 mb-3">
              <View className="bg-card p-4 rounded-xl border border-border">
                <Text className="text-textSecondary mb-1">Duration</Text>
                <Text className="text-text text-xl font-bold">
                  {formatDuration(completedWorkout.duration || 0)}
                </Text>
              </View>
            </View>
            <View className="w-1/2 pl-2 mb-3">
              <View className="bg-card p-4 rounded-xl border border-border">
                <Text className="text-textSecondary mb-1">Total Sets</Text>
                <Text className="text-text text-xl font-bold">
                  {completedWorkout.total_sets || completedWorkout.performed_sets?.length || 0}
                </Text>
              </View>
            </View>
            <View className="w-1/2 pr-2">
              <View className="bg-card p-4 rounded-xl border border-border">
                <Text className="text-textSecondary mb-1">Total Reps</Text>
                <Text className="text-text text-xl font-bold">
                  {completedWorkout.total_reps || 0}
                </Text>
              </View>
            </View>
            <View className="w-1/2 pl-2">
              <View className="bg-card p-4 rounded-xl border border-border">
                <Text className="text-textSecondary mb-1">Total Weight</Text>
                <Text className="text-text text-xl font-bold">
                  {completedWorkout.total_weight || 0} kg
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Exercise Performance */}
        {exerciseData.length > 0 && (
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-3">Exercise Performance</Text>
            
            {exerciseData.map((exercise, index) => {
              // Prepare data for charts
              const labels = exercise.sets.map(set => `Set ${set.setNumber}`);
              const weightData = exercise.sets.map(set => set.weight);
              const repsData = exercise.sets.map(set => set.reps);
              
              const weightChartData = {
                labels,
                datasets: [{ data: weightData }]
              };
              
              const repsChartData = {
                labels,
                datasets: [{ data: repsData }]
              };
              
              return (
                <View key={exercise.exerciseId} className="bg-card p-4 rounded-xl border border-border mb-4">
                  <Text className="text-text font-semibold mb-3">{exercise.exerciseName}</Text>
                  
                  <Text className="text-textSecondary mb-2">Weight (kg)</Text>
                  <BarChart
                    data={weightChartData}
                    width={screenWidth - 48}
                    height={180}
                    chartConfig={chartConfig}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    fromZero
                  />
                  
                  <Text className="text-textSecondary mb-2 mt-4">Reps</Text>
                  <BarChart
                    data={repsChartData}
                    width={screenWidth - 48}
                    height={180}
                    chartConfig={chartConfig}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    fromZero
                  />
                  
                  {/* Set details table */}
                  <View className="mt-4">
                    <View className="flex-row bg-background p-2 rounded-t-lg">
                      <Text className="flex-1 text-textSecondary font-medium">Set</Text>
                      <Text className="flex-1 text-textSecondary font-medium text-center">Weight (kg)</Text>
                      <Text className="flex-1 text-textSecondary font-medium text-right">Reps</Text>
                    </View>
                    
                    {exercise.sets.map((set, setIndex) => (
                      <View 
                        key={setIndex} 
                        className={`flex-row p-2 ${
                          setIndex % 2 === 0 ? 'bg-background/50' : 'bg-background'
                        } ${
                          setIndex === exercise.sets.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <Text className="flex-1 text-text">{set.setNumber}</Text>
                        <Text className="flex-1 text-text text-center">{set.weight}</Text>
                        <Text className="flex-1 text-text text-right">{set.reps}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* User Feedback */}
        {completedWorkout.user_feedback_comment && (
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-3">Your Notes</Text>
            <View className="bg-card p-4 rounded-xl border border-border">
              <Text className="text-text">{completedWorkout.user_feedback_comment}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          className="bg-primary py-3 rounded-full mb-6"
          onPress={() => router.push('/workouts')}
        >
          <Text className="text-white font-semibold text-center">Start New Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
