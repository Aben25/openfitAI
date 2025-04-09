import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Slider } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function FitnessLevels() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Fitness levels state
  const [cardioLevel, setCardioLevel] = useState(2); // 0-4 scale
  const [weightliftingLevel, setWeightliftingLevel] = useState(2); // 0-4 scale
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [avoidExercises, setAvoidExercises] = useState('');
  
  // Descriptions for fitness levels
  const cardioLevelDescriptions = [
    "Cannot walk 0.5 mile without stopping",
    "Can walk 1-2 miles, occasional light jogging",
    "Can jog/run 1-3 miles consistently",
    "Run 3-5 miles regularly, good endurance",
    "Run 10km+ regularly, excellent endurance"
  ];
  
  const weightliftingLevelDescriptions = [
    "Beginner, no regular gym experience",
    "Novice, some experience with basic exercises",
    "Intermediate, regular training for 6+ months",
    "Advanced, consistent training for 1+ years",
    "Expert/Competition level training"
  ];
  
  const handleContinue = async () => {
    setLoading(true);
    
    try {
      // Save to profile
      await updateProfile({
        cardio_level: cardioLevel,
        weightlifting_level: weightliftingLevel,
        fitness_level_notes: additionalInfo,
        avoid_exercises: avoidExercises,
        onboarding_step: 3
      });
      
      // Navigate to next screen
      router.push('/onboarding/workout-environment');
    } catch (error) {
      console.error('Error saving fitness levels:', error);
      alert('Failed to save your fitness levels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Current Fitness Levels</Text>
      <Text style={styles.subtitle}>Help us understand your current fitness level</Text>
      
      {/* Cardio/Endurance Level */}
      <Text style={styles.label}>Cardio/Endurance Level</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={cardioLevel}
          onValueChange={setCardioLevel}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#4A90E2"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelLeft}>Beginner</Text>
          <Text style={styles.sliderLabelRight}>Advanced</Text>
        </View>
      </View>
      <Text style={styles.levelDescription}>{cardioLevelDescriptions[cardioLevel]}</Text>
      
      {/* Weightlifting Level */}
      <Text style={styles.label}>Weightlifting Level</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={weightliftingLevel}
          onValueChange={setWeightliftingLevel}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#4A90E2"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelLeft}>Beginner</Text>
          <Text style={styles.sliderLabelRight}>Advanced</Text>
        </View>
      </View>
      <Text style={styles.levelDescription}>{weightliftingLevelDescriptions[weightliftingLevel]}</Text>
      
      {/* Additional Info */}
      <Text style={styles.label}>Please share anything else you would like about your fitness level (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Any additional information about your fitness level"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      {/* Exercises to Avoid */}
      <Text style={styles.label}>Is there any particular exercise you would like to avoid?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="List exercises you want to avoid due to injuries, preferences, etc."
        value={avoidExercises}
        onChangeText={setAvoidExercises}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
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
  sliderContainer: {
    marginBottom: 10,
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
  levelDescription: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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
