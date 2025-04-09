import { View, Text, ScrollView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

// Mock data for exercises
const MOCK_EXERCISES = [
  { id: '1', name: 'Squats', targetMuscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '2', name: 'Bench Press', targetMuscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '3', name: 'Deadlifts', targetMuscle: 'Back', equipment: 'Barbell', difficulty: 'Advanced' },
  { id: '4', name: 'Pull-ups', targetMuscle: 'Back', equipment: 'Body Weight', difficulty: 'Intermediate' },
  { id: '5', name: 'Push-ups', targetMuscle: 'Chest', equipment: 'Body Weight', difficulty: 'Beginner' },
  { id: '6', name: 'Lunges', targetMuscle: 'Legs', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { id: '7', name: 'Shoulder Press', targetMuscle: 'Shoulders', equipment: 'Dumbbell', difficulty: 'Intermediate' },
  { id: '8', name: 'Bicep Curls', targetMuscle: 'Arms', equipment: 'Dumbbell', difficulty: 'Beginner' },
  { id: '9', name: 'Tricep Extensions', targetMuscle: 'Arms', equipment: 'Cable', difficulty: 'Beginner' },
  { id: '10', name: 'Plank', targetMuscle: 'Core', equipment: 'Body Weight', difficulty: 'Beginner' },
];

// Filter categories
const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];
const EQUIPMENT_TYPES = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Body Weight'];
const DIFFICULTY_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  // Filter exercises based on search and filters
  const filteredExercises = MOCK_EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || exercise.targetMuscle === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'All' || exercise.equipment === selectedEquipment;
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty;
  });
  
  const renderExerciseItem = ({ item }) => (
    <Link href={`/exercises/${item.id}`} asChild>
      <TouchableOpacity>
        <View className="bg-card p-4 rounded-xl border border-border mb-3">
          <Text className="text-lg font-semibold text-text">{item.name}</Text>
          <View className="flex-row flex-wrap mt-2">
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-1">
              <Text className="text-textSecondary text-xs">{item.targetMuscle}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mr-2 mb-1">
              <Text className="text-textSecondary text-xs">{item.equipment}</Text>
            </View>
            <View className="bg-background px-3 py-1 rounded-full mb-1">
              <Text className="text-textSecondary text-xs">{item.difficulty}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
  
  const renderFilterChips = (options, selectedValue, setSelectedValue) => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-3"
    >
      {options.map(option => (
        <TouchableOpacity
          key={option}
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedValue === option ? 'bg-primary' : 'bg-card border border-border'
          }`}
          onPress={() => setSelectedValue(option)}
        >
          <Text
            className={`${
              selectedValue === option ? 'text-white' : 'text-textSecondary'
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-background p-4">
      {/* Search Bar */}
      <View className="bg-card rounded-xl border border-border p-2 mb-4 flex-row items-center">
        <Text className="text-textSecondary mx-2">🔍</Text>
        <TextInput
          className="flex-1 text-text p-1"
          placeholder="Search exercises..."
          placeholderTextColor="#757575"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Filters */}
      <View className="mb-4">
        <Text className="text-textSecondary mb-2">Muscle Group</Text>
        {renderFilterChips(MUSCLE_GROUPS, selectedMuscle, setSelectedMuscle)}
        
        <Text className="text-textSecondary mb-2">Equipment</Text>
        {renderFilterChips(EQUIPMENT_TYPES, selectedEquipment, setSelectedEquipment)}
        
        <Text className="text-textSecondary mb-2">Difficulty</Text>
        {renderFilterChips(DIFFICULTY_LEVELS, selectedDifficulty, setSelectedDifficulty)}
      </View>
      
      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="bg-card p-4 rounded-xl border border-border items-center">
            <Text className="text-text text-center">No exercises match your filters.</Text>
          </View>
        }
      />
    </View>
  );
}
