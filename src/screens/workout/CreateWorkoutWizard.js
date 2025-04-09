import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkout } from '../../context/WorkoutContext';

// Step 1: Basic Workout Info
const Step1 = ({ workoutData, setWorkoutData, onNext }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!workoutData.name || workoutData.name.trim() === '') {
      newErrors.name = 'Workout name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-primary mb-6">Create New Workout</Text>
      
      <View className="mb-4">
        <Text className="text-textSecondary mb-1">Workout Name</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-border"
          placeholder="Enter workout name"
          placeholderTextColor="#757575"
          value={workoutData.name}
          onChangeText={(text) => setWorkoutData({ ...workoutData, name: text })}
        />
        {errors.name && <Text className="text-error mt-1">{errors.name}</Text>}
      </View>
      
      <View className="mb-4">
        <Text className="text-textSecondary mb-1">Description (Optional)</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-border h-24"
          placeholder="Describe your workout"
          placeholderTextColor="#757575"
          multiline
          textAlignVertical="top"
          value={workoutData.description}
          onChangeText={(text) => setWorkoutData({ ...workoutData, description: text })}
        />
      </View>
      
      <TouchableOpacity
        className="bg-primary py-3 rounded-full mt-4"
        onPress={handleNext}
      >
        <Text className="text-white font-semibold text-center">Next: Add Exercises</Text>
      </TouchableOpacity>
    </View>
  );
};

// Step 2: Exercise Selection
const Step2 = ({ workoutData, setWorkoutData, onNext, onBack }) => {
  const [selectedExercises, setSelectedExercises] = useState(workoutData.exercises || []);
  const [errors, setErrors] = useState({});
  
  // This would be populated from the ExerciseContext in a real implementation
  const dummyExercises = [
    { id: 1, name: 'Bench Press', category: 'Chest', equipment: 'Barbell' },
    { id: 2, name: 'Squat', category: 'Legs', equipment: 'Barbell' },
    { id: 3, name: 'Deadlift', category: 'Back', equipment: 'Barbell' },
    { id: 4, name: 'Pull-up', category: 'Back', equipment: 'Bodyweight' },
    { id: 5, name: 'Push-up', category: 'Chest', equipment: 'Bodyweight' },
  ];

  const toggleExercise = (exercise) => {
    if (selectedExercises.some(e => e.id === exercise.id)) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (selectedExercises.length === 0) {
      newErrors.exercises = 'Please select at least one exercise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setWorkoutData({ ...workoutData, exercises: selectedExercises });
      onNext();
    }
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-primary mb-6">Select Exercises</Text>
      
      {errors.exercises && <Text className="text-error mb-4">{errors.exercises}</Text>}
      
      <ScrollView className="mb-4 max-h-96">
        {dummyExercises.map(exercise => (
          <TouchableOpacity
            key={exercise.id}
            className={`p-4 mb-2 rounded-lg border ${
              selectedExercises.some(e => e.id === exercise.id)
                ? 'bg-primary/10 border-primary'
                : 'bg-card border-border'
            }`}
            onPress={() => toggleExercise(exercise)}
          >
            <Text className="font-semibold text-text">{exercise.name}</Text>
            <Text className="text-textSecondary">{exercise.category} • {exercise.equipment}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="bg-card py-3 px-6 rounded-full border border-border"
          onPress={onBack}
        >
          <Text className="text-text font-semibold text-center">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-primary py-3 px-6 rounded-full"
          onPress={handleNext}
        >
          <Text className="text-white font-semibold text-center">Next: Configure Sets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Step 3: Configure Sets and Reps
const Step3 = ({ workoutData, setWorkoutData, onNext, onBack, onSubmit, isLoading }) => {
  const [exerciseConfigs, setExerciseConfigs] = useState(
    workoutData.exercises.map(exercise => ({
      exercise_id: exercise.id,
      sets: 3,
      reps: 10,
      rest_interval: 60,
      order: 0
    }))
  );

  const updateExerciseConfig = (index, field, value) => {
    const newConfigs = [...exerciseConfigs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setExerciseConfigs(newConfigs);
  };

  const handleSubmit = () => {
    // Prepare final workout data with exercise configurations
    const finalWorkoutData = {
      ...workoutData,
      exerciseConfigs
    };
    
    onSubmit(finalWorkoutData);
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-primary mb-6">Configure Sets & Reps</Text>
      
      <ScrollView className="mb-4 max-h-96">
        {workoutData.exercises.map((exercise, index) => (
          <View key={exercise.id} className="p-4 mb-4 rounded-lg border border-border bg-card">
            <Text className="font-semibold text-text mb-2">{exercise.name}</Text>
            
            <View className="flex-row justify-between mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-textSecondary mb-1">Sets</Text>
                <TextInput
                  className="bg-background text-text p-2 rounded-lg border border-border"
                  keyboardType="numeric"
                  value={exerciseConfigs[index].sets.toString()}
                  onChangeText={(text) => updateExerciseConfig(index, 'sets', parseInt(text) || 0)}
                />
              </View>
              
              <View className="flex-1 mx-2">
                <Text className="text-textSecondary mb-1">Reps</Text>
                <TextInput
                  className="bg-background text-text p-2 rounded-lg border border-border"
                  keyboardType="numeric"
                  value={exerciseConfigs[index].reps.toString()}
                  onChangeText={(text) => updateExerciseConfig(index, 'reps', parseInt(text) || 0)}
                />
              </View>
              
              <View className="flex-1 ml-2">
                <Text className="text-textSecondary mb-1">Rest (sec)</Text>
                <TextInput
                  className="bg-background text-text p-2 rounded-lg border border-border"
                  keyboardType="numeric"
                  value={exerciseConfigs[index].rest_interval.toString()}
                  onChangeText={(text) => updateExerciseConfig(index, 'rest_interval', parseInt(text) || 0)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="bg-card py-3 px-6 rounded-full border border-border"
          onPress={onBack}
          disabled={isLoading}
        >
          <Text className="text-text font-semibold text-center">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-primary py-3 px-6 rounded-full"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-semibold text-center">Create Workout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function CreateWorkoutWizard() {
  const [step, setStep] = useState(1);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    description: '',
    exercises: [],
  });
  
  const { createNewWorkout, isLoading, error } = useWorkout();
  const router = useRouter();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (finalWorkoutData) => {
    // Extract basic workout data
    const { name, description } = finalWorkoutData;
    
    // Create the workout
    const workout = await createNewWorkout({
      name,
      description,
      is_active: true,
    });
    
    if (workout) {
      // In a real implementation, we would add exercises to the workout here
      // using the addExerciseToWorkout function from the ExerciseContext
      
      // Navigate to the workout detail screen
      router.replace(`/workouts/${workout.id}`);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-center mb-4 pt-4">
        <View className={`h-2 w-20 rounded-full mx-1 ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
        <View className={`h-2 w-20 rounded-full mx-1 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
        <View className={`h-2 w-20 rounded-full mx-1 ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
      </View>
      
      {error && (
        <View className="mx-4 mb-4 p-3 bg-error/10 border border-error rounded-lg">
          <Text className="text-error">{error}</Text>
        </View>
      )}
      
      {step === 1 && (
        <Step1 
          workoutData={workoutData} 
          setWorkoutData={setWorkoutData} 
          onNext={handleNext} 
        />
      )}
      
      {step === 2 && (
        <Step2 
          workoutData={workoutData} 
          setWorkoutData={setWorkoutData} 
          onNext={handleNext} 
          onBack={handleBack} 
        />
      )}
      
      {step === 3 && (
        <Step3 
          workoutData={workoutData} 
          setWorkoutData={setWorkoutData} 
          onNext={handleNext} 
          onBack={handleBack} 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
