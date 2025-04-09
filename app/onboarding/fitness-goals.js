import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function FitnessGoals() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Goals state
  const [goals, setGoals] = useState([
    { id: 'health', name: 'Optimize my health and fitness', selected: false, description: 'Focus on overall wellness, balanced fitness, and long-term health benefits.' },
    { id: 'sport', name: 'Training for a specific sport or activity', selected: false, description: '' },
    { id: 'muscle', name: 'Build muscle mass and size', selected: false, description: 'Focus on hypertrophy training to increase muscle size and definition.' },
    { id: 'weight', name: 'Weight loss and management', selected: false, description: 'Focus on fat loss while preserving muscle mass through balanced nutrition and exercise.' },
    { id: 'stamina', name: 'Increase stamina', selected: false, description: 'Improve cardiovascular endurance and overall energy levels.' },
    { id: 'strength', name: 'Increase strength', selected: false, description: 'Focus on progressive overload to build functional and maximal strength.' },
  ]);
  
  const [sportActivity, setSportActivity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Toggle goal selection
  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, selected: !goal.selected } : goal
    ));
  };
  
  // Check if sport goal is selected
  const isSportSelected = goals.find(goal => goal.id === 'sport')?.selected || false;
  
  // Count selected goals
  const selectedGoalsCount = goals.filter(goal => goal.selected).length;
  
  const handleContinue = async () => {
    // Validate inputs
    if (selectedGoalsCount === 0) {
      alert('Please select at least one fitness goal');
      return;
    }
    
    if (isSportSelected && !sportActivity.trim()) {
      alert('Please specify your sport or activity');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare goals data
      const selectedGoals = goals
        .filter(goal => goal.selected)
        .map((goal, index) => ({
          id: goal.id,
          name: goal.name,
          priority: index + 1,
          description: goal.id === 'sport' ? sportActivity : goal.description
        }));
      
      // Save to profile
      await updateProfile({
        fitness_goals: selectedGoals,
        additional_coach_info: additionalInfo,
        onboarding_step: 2
      });
      
      // Navigate to next screen
      router.push('/onboarding/fitness-levels');
    } catch (error) {
      console.error('Error saving fitness goals:', error);
      alert('Failed to save your fitness goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Fitness Goals</Text>
      <Text style={styles.subtitle}>Select your fitness goals in order of preference</Text>
      
      {/* Goals Selection */}
      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalContainer}>
          <TouchableOpacity 
            style={styles.goalRow}
            onPress={() => toggleGoal(goal.id)}
          >
            <View style={[styles.checkbox, goal.selected && styles.checkboxSelected]}>
              {goal.selected && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.goalText}>{goal.name}</Text>
          </TouchableOpacity>
          
          {goal.selected && goal.description && (
            <Text style={styles.goalDescription}>{goal.description}</Text>
          )}
          
          {/* Sport/Activity Input */}
          {goal.selected && goal.id === 'sport' && (
            <TextInput
              style={styles.input}
              placeholder="What is your sport or activity?"
              value={sportActivity}
              onChangeText={setSportActivity}
            />
          )}
        </View>
      ))}
      
      {/* Additional Info */}
      <Text style={styles.label}>Is there anything else I should know as your personal health coach?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Optional: Share any additional information"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
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
  goalContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4A90E2',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  goalDescription: {
    marginTop: 10,
    marginLeft: 34,
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    marginLeft: 34,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
    marginLeft: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
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
