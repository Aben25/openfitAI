import { View, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

// Mock data for workouts
const MOCK_WORKOUTS = [
  { id: '1', name: 'Full Body Strength', exercises: 8, duration: '45 min', lastPerformed: '2 days ago' },
  { id: '2', name: 'Upper Body Focus', exercises: 6, duration: '30 min', lastPerformed: '5 days ago' },
  { id: '3', name: 'Lower Body Power', exercises: 7, duration: '40 min', lastPerformed: '1 week ago' },
  { id: '4', name: 'Core Crusher', exercises: 5, duration: '25 min', lastPerformed: '3 days ago' },
  { id: '5', name: 'Cardio Blast', exercises: 4, duration: '20 min', lastPerformed: 'Today' },
];

export default function WorkoutsScreen() {
  const [activeTab, setActiveTab] = useState('my');
  
  const renderWorkoutItem = ({ item }) => (
    <Link href={`/workouts/${item.id}`} asChild>
      <Pressable>
        <View className="bg-card p-4 rounded-xl border border-border mb-3">
          <Text className="text-lg font-semibold text-text">{item.name}</Text>
          <View className="flex-row justify-between mt-2">
            <Text className="text-textSecondary">{item.exercises} exercises</Text>
            <Text className="text-textSecondary">{item.duration}</Text>
          </View>
          <Text className="text-xs text-textSecondary mt-2">Last performed: {item.lastPerformed}</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View className="flex-1 bg-background p-4">
      {/* Tabs */}
      <View className="flex-row bg-card rounded-lg mb-4 p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'my' ? 'bg-primary' : ''}`}
          onPress={() => setActiveTab('my')}
        >
          <Text className={`text-center ${activeTab === 'my' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
            My Workouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'recommended' ? 'bg-primary' : ''}`}
          onPress={() => setActiveTab('recommended')}
        >
          <Text className={`text-center ${activeTab === 'recommended' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
            Recommended
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Workout List */}
      <FlatList
        data={MOCK_WORKOUTS}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        className="mb-16"
      />
      
      {/* Create Workout Button - Fixed at bottom */}
      <View className="absolute bottom-4 right-4 left-4">
        <Link href="/workouts/create" asChild>
          <TouchableOpacity className="bg-primary py-3 rounded-full">
            <Text className="text-white font-semibold text-center">Create New Workout</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
