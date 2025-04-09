import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTracking } from '../../context/TrackingContext';
import { useWorkout } from '../../context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';

// Timer display component
const Timer = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return (
    <Text className="text-text text-4xl font-bold">
      {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
    </Text>
  );
};

// Rest timer component
const RestTimer = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timerRef = useRef(null);
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const progress = (seconds - timeLeft) / seconds;
  
  return (
    <View className="items-center">
      <Text className="text-primary text-lg font-semibold mb-2">Rest Time</Text>
      <Text className="text-text text-3xl font-bold mb-4">{timeLeft}s</Text>
      <View className="w-full h-2 bg-border rounded-full overflow-hidden">
        <View 
          className="h-full bg-primary rounded-full" 
          style={{ width: `${progress * 100}%` }} 
        />
      </View>
    </View>
  );
};

export default function ActiveWorkout() {
  const { activeWorkout, timer, isTimerRunning, startTimer, pauseTimer, completeWorkoutSession, logSet } = useTracking();
  const { fetchWorkoutById } = useWorkout();
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSets, setCompletedSets] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    if (activeWorkout) {
      loadWorkoutDetails();
    } else {
      // No active workout, redirect to workouts list
      router.replace('/workouts');
    }
  }, [activeWorkout]);
  
  const loadWorkoutDetails = async () => {
    if (!activeWorkout) return;
    
    setIsLoading(true);
    const data = await fetchWorkoutById(activeWorkout.workout_id);
    if (data) {
      // Sort exercises by order
      const sortedExercises = [...data.workout_exercises].sort((a, b) => a.order - b.order);
      setWorkout({
        ...data,
        workout_exercises: sortedExercises
      });
    }
    setIsLoading(false);
  };
  
  const getCurrentExercise = () => {
    if (!workout || !workout.workout_exercises || workout.workout_exercises.length === 0) {
      return null;
    }
    
    return workout.workout_exercises[currentExerciseIndex];
  };
  
  const handleLogSet = async () => {
    const currentExercise = getCurrentExercise();
    if (!currentExercise) return;
    
    // Log the completed set
    const setData = {
      workout_exercise_id: currentExercise.id,
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      set_number: currentSetIndex + 1
    };
    
    const loggedSet = await logSet(setData);
    
    if (loggedSet) {
      // Add to completed sets
      setCompletedSets([...completedSets, setData]);
      
      // Check if we need to move to the next set or exercise
      if (currentSetIndex + 1 < currentExercise.sets) {
        // Start rest timer
        setIsResting(true);
        // Move to next set after rest
        // Rest timer will call handleRestComplete when done
      } else {
        // Move to next exercise
        if (currentExerciseIndex + 1 < workout.workout_exercises.length) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSetIndex(0);
          setIsResting(true);
        } else {
          // Workout complete
          handleCompleteWorkout();
        }
      }
      
      // Reset input fields
      setWeight('');
      setReps('');
    }
  };
  
  const handleRestComplete = () => {
    setIsResting(false);
    
    // If we were on the last set of an exercise, we've already moved to the next exercise
    // Otherwise, move to the next set
    if (currentSetIndex + 1 < getCurrentExercise()?.sets) {
      setCurrentSetIndex(currentSetIndex + 1);
    }
  };
  
  const handleCompleteWorkout = async () => {
    setIsLoading(true);
    
    // Calculate some stats for the completed workout
    const totalSets = completedSets.length;
    const totalReps = completedSets.reduce((sum, set) => sum + set.reps, 0);
    const totalWeight = completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    
    const completionData = {
      total_sets: totalSets,
      total_reps: totalReps,
      total_weight: totalWeight
    };
    
    const completedWorkout = await completeWorkoutSession(completionData);
    
    if (completedWorkout) {
      // Navigate to workout summary
      router.replace(`/progress/workout/${completedWorkout.id}`);
    }
    
    setIsLoading(false);
  };
  
  const handlePauseResume = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };
  
  if (isLoading || !workout) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#5D4FEB" />
      </View>
    );
  }
  
  const currentExercise = getCurrentExercise();
  
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Workout Header */}
          <View className="items-center mb-6">
            <Text className="text-textSecondary">ACTIVE WORKOUT</Text>
            <Text className="text-text text-2xl font-bold">{workout.name}</Text>
            <View className="mt-4 items-center">
              <Timer seconds={timer} />
              <TouchableOpacity
                className="mt-2 flex-row items-center"
                onPress={handlePauseResume}
              >
                <Ionicons 
                  name={isTimerRunning ? "pause" : "play"} 
                  size={16} 
                  color="#5D4FEB" 
                />
                <Text className="text-primary ml-1">
                  {isTimerRunning ? "Pause" : "Resume"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Rest Timer */}
          {isResting && currentExercise && (
            <View className="bg-card p-4 rounded-xl border border-border mb-6">
              <RestTimer 
                seconds={currentExercise.rest_interval} 
                onComplete={handleRestComplete} 
              />
            </View>
          )}
          
          {/* Current Exercise */}
          {!isResting && currentExercise && (
            <View className="bg-card p-4 rounded-xl border border-border mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-textSecondary">CURRENT EXERCISE</Text>
                  <Text className="text-text text-xl font-bold">{currentExercise.exercises.name}</Text>
                </View>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-primary">
                    Set {currentSetIndex + 1}/{currentExercise.sets}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-textSecondary mb-1">Weight (kg)</Text>
                  <TextInput
                    className="bg-background text-text p-3 rounded-lg border border-border"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="0"
                    placeholderTextColor="#757575"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-textSecondary mb-1">Reps</Text>
                  <TextInput
                    className="bg-background text-text p-3 rounded-lg border border-border"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                    placeholder={currentExercise.reps.toString()}
                    placeholderTextColor="#757575"
                  />
                </View>
              </View>
              
              <TouchableOpacity
                className="bg-primary py-3 rounded-full"
                onPress={handleLogSet}
              >
                <Text className="text-white font-semibold text-center">Complete Set</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Workout Progress */}
          <View className="mb-6">
            <Text className="text-text text-lg font-semibold mb-3">Workout Progress</Text>
            <View className="bg-card p-4 rounded-xl border border-border">
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary">Exercise</Text>
                <Text className="text-textSecondary">Progress</Text>
              </View>
              
              {workout.workout_exercises.map((exercise, index) => {
                const exerciseSets = completedSets.filter(
                  set => set.workout_exercise_id === exercise.id
                ).length;
                const progress = exerciseSets / exercise.sets;
                
                return (
                  <View key={exercise.id} className="mb-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text 
                        className={`${index === currentExerciseIndex ? 'text-primary font-semibold' : 'text-text'}`}
                      >
                        {exercise.exercises.name}
                      </Text>
                      <Text className="text-textSecondary">
                        {exerciseSets}/{exercise.sets} sets
                      </Text>
                    </View>
                    <View className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <View 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${progress * 100}%` }} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View className="p-4 border-t border-border bg-card">
        <TouchableOpacity
          className="bg-error py-3 rounded-full"
          onPress={handleCompleteWorkout}
        >
          <Text className="text-white font-semibold text-center">End Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
