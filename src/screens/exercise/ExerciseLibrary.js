import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useExercise } from '../../context/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';

export default function ExerciseLibrary() {
  const { exercises, categories, equipment, isLoading, error, fetchExercises } = useExercise();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (exercises) {
      let filtered = [...exercises];
      
      // Apply search filter
      if (searchQuery.trim() !== '') {
        filtered = filtered.filter(exercise => 
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(exercise => exercise.category === selectedCategory);
      }
      
      // Apply equipment filter
      if (selectedEquipment) {
        filtered = filtered.filter(exercise => exercise.equipment === selectedEquipment);
      }
      
      setFilteredExercises(filtered);
    }
  }, [exercises, searchQuery, selectedCategory, selectedEquipment]);

  const handleExercisePress = (exerciseId) => {
    router.push(`/exercises/${exerciseId}`);
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      className="bg-card p-4 mb-3 rounded-xl border border-border"
      onPress={() => handleExercisePress(item.id)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text text-lg font-semibold">{item.name}</Text>
        <View className="bg-primary/10 px-3 py-1 rounded-full">
          <Text className="text-primary text-xs">{item.category}</Text>
        </View>
      </View>
      
      {item.equipment && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="barbell-outline" size={16} color="#757575" />
          <Text className="text-textSecondary ml-1">{item.equipment}</Text>
        </View>
      )}
      
      {item.description && (
        <Text className="text-textSecondary mb-2" numberOfLines={2}>
          {item.description}
        </Text>
      )}
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          {item.primary_muscle && (
            <View className="bg-background px-3 py-1 rounded-full mr-2">
              <Text className="text-textSecondary text-xs">{item.primary_muscle}</Text>
            </View>
          )}
          {item.secondary_muscle && (
            <View className="bg-background px-3 py-1 rounded-full">
              <Text className="text-textSecondary text-xs">{item.secondary_muscle}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => handleExercisePress(item.id)}
        >
          <Text className="text-primary mr-1">Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#5D4FEB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full mr-2 ${
        selectedCategory === item ? 'bg-primary' : 'bg-card border border-border'
      }`}
      onPress={() => setSelectedCategory(selectedCategory === item ? '' : item)}
    >
      <Text
        className={`${
          selectedCategory === item ? 'text-white' : 'text-text'
        } font-medium`}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderEquipmentItem = ({ item }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full mr-2 ${
        selectedEquipment === item ? 'bg-primary' : 'bg-card border border-border'
      }`}
      onPress={() => setSelectedEquipment(selectedEquipment === item ? '' : item)}
    >
      <Text
        className={`${
          selectedEquipment === item ? 'text-white' : 'text-text'
        } font-medium`}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-6">Exercise Library</Text>
      
      <View className="flex-row items-center bg-card border border-border rounded-lg px-3 py-2 mb-4">
        <Ionicons name="search" size={20} color="#757575" />
        <TextInput
          className="flex-1 ml-2 text-text"
          placeholder="Search exercises..."
          placeholderTextColor="#757575"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Category filters */}
      <View className="mb-4">
        <Text className="text-textSecondary mb-2">Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {/* Equipment filters */}
      <View className="mb-4">
        <Text className="text-textSecondary mb-2">Equipment</Text>
        <FlatList
          data={equipment}
          renderItem={renderEquipmentItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#5D4FEB" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-error text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-full"
            onPress={fetchExercises}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredExercises.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="barbell-outline" size={64} color="#5D4FEB" />
          <Text className="text-textSecondary text-center mt-4">
            {searchQuery.trim() !== '' || selectedCategory || selectedEquipment
              ? "No exercises match your filters"
              : "No exercises found"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          renderItem={renderExerciseItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-20"
        />
      )}
    </View>
  );
}
