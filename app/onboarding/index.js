import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AboutYou() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'ft'
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' or 'lbs'
  const [weight, setWeight] = useState('');

  const handleContinue = async () => {
    // Validate inputs
    if (!gender || !age || !weight || 
        (heightUnit === 'cm' && !heightCm) || 
        (heightUnit === 'ft' && (!heightFt || !heightIn))) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Calculate height in cm for storage
      let heightInCm;
      if (heightUnit === 'cm') {
        heightInCm = parseFloat(heightCm);
      } else {
        // Convert ft/in to cm
        const feet = parseFloat(heightFt) || 0;
        const inches = parseFloat(heightIn) || 0;
        heightInCm = (feet * 30.48) + (inches * 2.54);
      }
      
      // Calculate weight in kg for storage
      let weightInKg;
      if (weightUnit === 'kg') {
        weightInKg = parseFloat(weight);
      } else {
        // Convert lbs to kg
        weightInKg = parseFloat(weight) * 0.453592;
      }
      
      // Save to profile
      await updateProfile({
        gender,
        age: parseInt(age),
        height_cm: heightInCm,
        weight_kg: weightInKg,
        height_unit: heightUnit,
        weight_unit: weightUnit,
        onboarding_step: 1
      });
      
      // Navigate to next screen
      router.push('/onboarding/fitness-goals');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>About You</Text>
        <Text style={styles.subtitle}>Let's get to know you better</Text>
        
        {/* Gender Selection */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.optionButton, gender === 'male' && styles.selectedOption]}
            onPress={() => setGender('male')}
          >
            <Text style={[styles.optionText, gender === 'male' && styles.selectedOptionText]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionButton, gender === 'female' && styles.selectedOption]}
            onPress={() => setGender('female')}
          >
            <Text style={[styles.optionText, gender === 'female' && styles.selectedOptionText]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionButton, gender === 'other' && styles.selectedOption]}
            onPress={() => setGender('other')}
          >
            <Text style={[styles.optionText, gender === 'other' && styles.selectedOptionText]}>Other</Text>
          </TouchableOpacity>
        </View>
        
        {/* Age Input */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
        />
        
        {/* Height Input */}
        <Text style={styles.label}>Height</Text>
        <View style={styles.unitSelector}>
          <TouchableOpacity 
            style={[styles.unitButton, heightUnit === 'cm' && styles.selectedUnit]}
            onPress={() => setHeightUnit('cm')}
          >
            <Text style={[styles.unitText, heightUnit === 'cm' && styles.selectedUnitText]}>cm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.unitButton, heightUnit === 'ft' && styles.selectedUnit]}
            onPress={() => setHeightUnit('ft')}
          >
            <Text style={[styles.unitText, heightUnit === 'ft' && styles.selectedUnitText]}>ft/in</Text>
          </TouchableOpacity>
        </View>
        
        {heightUnit === 'cm' ? (
          <TextInput
            style={styles.input}
            placeholder="Height in cm"
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="number-pad"
          />
        ) : (
          <View style={styles.ftInContainer}>
            <TextInput
              style={[styles.input, styles.ftInput]}
              placeholder="ft"
              value={heightFt}
              onChangeText={setHeightFt}
              keyboardType="number-pad"
            />
            <TextInput
              style={[styles.input, styles.inInput]}
              placeholder="in"
              value={heightIn}
              onChangeText={setHeightIn}
              keyboardType="number-pad"
            />
          </View>
        )}
        
        {/* Weight Input */}
        <Text style={styles.label}>Weight</Text>
        <View style={styles.unitSelector}>
          <TouchableOpacity 
            style={[styles.unitButton, weightUnit === 'kg' && styles.selectedUnit]}
            onPress={() => setWeightUnit('kg')}
          >
            <Text style={[styles.unitText, weightUnit === 'kg' && styles.selectedUnitText]}>kg</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.unitButton, weightUnit === 'lbs' && styles.selectedUnit]}
            onPress={() => setWeightUnit('lbs')}
          >
            <Text style={[styles.unitText, weightUnit === 'lbs' && styles.selectedUnitText]}>lbs</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={`Weight in ${weightUnit}`}
          value={weight}
          onChangeText={setWeight}
          keyboardType="number-pad"
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
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
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  unitButton: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedUnit: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  selectedUnitText: {
    color: '#fff',
    fontWeight: '600',
  },
  ftInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ftInput: {
    flex: 1,
    marginRight: 10,
  },
  inInput: {
    flex: 1,
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
