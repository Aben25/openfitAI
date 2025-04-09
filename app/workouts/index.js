import { View, Text, FlatList, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useWorkout } from '../../src/context/WorkoutContext';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { 
    workouts, 
    recommendedWorkouts, 
    isLoading, 
    error, 
    fetchWorkouts, 
    getRecommendedWorkouts 
  } = useWorkout();
  
  const [activeTab, setActiveTab] = useState('my');
  
  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
    getRecommendedWorkouts();
  }, []);
  
  const renderWorkoutItem = ({ item }) => (
    <Link href={`/workouts/${item.id}`} asChild>
      <Pressable>
        <View className="bg-card p-4 rounded-xl border border-border mb-3">
          <Text className="text-lg font-semibold text-text">{item.name}</Text>
          
          {/* Category tag if available */}
          {item.category && (
            <View className="bg-primary/20 self-start px-2 py-1 rounded-md mt-1 mb-2">
              <Text className="text-xs text-primary font-medium">{item.category}</Text>
            </View>
          )}
          
          <View className="flex-row justify-between mt-2">
            <Text className="text-textSecondary">
              {item.workout_exercises ? item.workout_exercises.length : 0} exercises
            </Text>
            <Text className="text-textSecondary">{item.estimated_duration || '—'} min</Text>
          </View>
          
          {item.last_performed && (
            <Text className="text-xs text-textSecondary mt-2">
              Last performed: {new Date(item.last_performed).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );

  // Display content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text className="text-textSecondary mt-4">Loading workouts...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-error mb-4">Failed to load workouts</Text>
          <TouchableOpacity 
            className="bg-primary py-2 px-4 rounded-lg"
            onPress={() => activeTab === 'my' ? fetchWorkouts() : getRecommendedWorkouts()}
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const dataToShow = activeTab === 'my' ? workouts : recommendedWorkouts;
    
    if (dataToShow.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <Text className="text-textSecondary mb-4">
            {activeTab === 'my' 
              ? "You don't have any workouts yet" 
              : "No recommended workouts available"}
          </Text>
          {activeTab === 'my' && (
            <TouchableOpacity 
              className="bg-primary py-2 px-4 rounded-lg"
              onPress={() => router.push('/workouts/create')}
            >
              <Text className="text-white">Create Your First Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    
    return (
      <FlatList
        data={dataToShow}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        className="mb-16"
      />
    );
  };

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
      {renderContent()}
      
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
