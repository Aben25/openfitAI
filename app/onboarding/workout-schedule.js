import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Slider } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function WorkoutSchedule() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Schedule state
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState(3); // Default to 3 days
  const [workoutDuration, setWorkoutDuration] = useState(45); // Default to 45 minutes
  const [optimizeDuration, setOptimizeDuration] = useState(false);
  
  // Duration options in minutes
  const durations = [15, 30, 45, 60, 75, 90];
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // Save to profile
      await updateProfile({
        workouts_per_week: workoutsPerWeek,
        workout_duration: optimizeDuration ? 'optimize' : workoutDuration,
        onboarding_step: 5
      });
      
      // Navigate to next screen
      router.push('/onboarding/anything-else');
    } catch (error) {
      console.error('Error saving workout schedule:', error);
      alert('Failed to save your workout schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Workout Schedule</Text>
      <Text style={styles.subtitle}>Let's plan your workout routine</Text>
      
      {/* Workouts Per Week */}
      <Text style={styles.label}>How many days per week do you want to work out?</Text>
      <Text style={styles.valueDisplay}>{workoutsPerWeek} {workoutsPerWeek === 1 ? 'day' : 'days'}</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={2}
          maximumValue={7}
          step={1}
          value={workoutsPerWeek}
          onValueChange={setWorkoutsPerWeek}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#4A90E2"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelLeft}>2 days</Text>
          <Text style={styles.sliderLabelRight}>7 days</Text>
        </View>
      </View>
      
      {/* Workout Duration */}
      <Text style={styles.label}>Preferred workout duration</Text>
      
      <TouchableOpacity 
        style={[styles.optimizeOption, optimizeDuration && styles.selectedOption]}
        onPress={() => setOptimizeDuration(true)}
      >
        <View style={styles.optionHeader}>
          <Text style={[styles.optionTitle, optimizeDuration && styles.selectedText]}>
            Optimize for me
          </Text>
          <View style={[styles.radioButton, optimizeDuration && styles.radioSelected]}>
            {optimizeDuration && <View style={styles.radioInner} />}
          </View>
        </View>
        <Text style={[styles.optionDescription, optimizeDuration && styles.selectedText]}>
          Let the app determine the optimal workout duration based on your goals
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.optimizeOption, !optimizeDuration && styles.selectedOption]}
        onPress={() => setOptimizeDuration(false)}
      >
        <View style={styles.optionHeader}>
          <Text style={[styles.optionTitle, !optimizeDuration && styles.selectedText]}>
            I'll choose
          </Text>
          <View style={[styles.radioButton, !optimizeDuration && styles.radioSelected]}>
            {!optimizeDuration && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
      
      {!optimizeDuration && (
        <View style={styles.durationContainer}>
          <Text style={styles.valueDisplay}>{workoutDuration} minutes</Text>
          <View style={styles.durationButtons}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  workoutDuration === duration && styles.selectedDuration
                ]}
                onPress={() => setWorkoutDuration(duration)}
              >
                <Text 
                  style={[
                    styles.durationButtonText,
                    workoutDuration === duration && styles.selectedDurationText
                  ]}
                >
                  {duration}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  valueDisplay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginVertical: 10,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabelLeft: {
    fontSize: 14,
    color: '#666',
  },
  sliderLabelRight: {
    fontSize: 14,
    color: '#666',
  },
  optimizeOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  selectedText: {
    color: '#fff',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#fff',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  durationContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  durationButton: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedDuration: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  durationButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDurationText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a5c7f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
