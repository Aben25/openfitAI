import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function WorkoutEnvironment() {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Environment options
  const [environments, setEnvironments] = useState([
    { id: 'large_gym', name: 'Large gym', selected: false, description: 'Access to a wide range of equipment' },
    { id: 'small_gym', name: 'Small gym', selected: false, description: 'Limited equipment selection' },
    { id: 'home_basic', name: 'Home (basic equipment)', selected: false, description: 'Dumbbells, resistance bands, etc.' },
    { id: 'home_none', name: 'Home (no equipment)', selected: false, description: 'Bodyweight exercises only' },
  ]);
  
  // Toggle environment selection
  const toggleEnvironment = (id) => {
    setEnvironments(environments.map(env => 
      env.id === id ? { ...env, selected: !env.selected } : env
    ));
  };
  
  // Count selected environments
  const selectedCount = environments.filter(env => env.selected).length;
  
  const handleContinue = async () => {
    // Validate inputs
    if (selectedCount === 0) {
      alert('Please select at least one workout environment');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare environments data
      const selectedEnvironments = environments
        .filter(env => env.selected)
        .map(env => ({
          id: env.id,
          name: env.name
        }));
      
      // Save to profile
      await updateProfile({
        workout_environments: selectedEnvironments,
        onboarding_step: 4
      });
      
      // Navigate to next screen
      router.push('/onboarding/workout-schedule');
    } catch (error) {
      console.error('Error saving workout environments:', error);
      alert('Failed to save your workout environments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Workout Environment</Text>
      <Text style={styles.subtitle}>Where will you be working out?</Text>
      <Text style={styles.instruction}>Select all that apply</Text>
      
      {/* Environment Selection */}
      {environments.map((env) => (
        <TouchableOpacity 
          key={env.id}
          style={[styles.optionCard, env.selected && styles.selectedCard]}
          onPress={() => toggleEnvironment(env.id)}
        >
          <View style={styles.optionHeader}>
            <Text style={[styles.optionTitle, env.selected && styles.selectedText]}>{env.name}</Text>
            <View style={[styles.checkbox, env.selected && styles.checkboxSelected]}>
              {env.selected && <View style={styles.checkboxInner} />}
            </View>
          </View>
          <Text style={[styles.optionDescription, env.selected && styles.selectedText]}>
            {env.description}
          </Text>
        </TouchableOpacity>
      ))}
      
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
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  selectedCard: {
    borderColor: '#4A90E2',
    backgroundColor: '#4A90E2',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#fff',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
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
