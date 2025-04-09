import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AnythingElse() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Additional info state
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Complete onboarding with final data
      await completeOnboarding({
        additional_info: additionalInfo,
        onboarding_completed: true
      });
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Anything Else?</Text>
      <Text style={styles.subtitle}>Almost done! Just one last question</Text>
      
      <Text style={styles.label}>Please share anything else you would like me to know?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Optional: Share any additional information that might help us create the perfect workout plan for you"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Complete Setup</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.note}>
        You can always update your preferences later in your profile settings.
      </Text>
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
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 150,
    paddingTop: 15,
    paddingBottom: 15,
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
  note: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
