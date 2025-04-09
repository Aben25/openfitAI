import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-background">
      <StatusBar style="light" />
      
      <View className="flex-1 items-center justify-center p-4 pt-8">
        <Text className="text-3xl font-bold text-primary mb-2">FitTrack</Text>
        <Text className="text-xl text-textSecondary mb-8 text-center">Your comprehensive fitness companion</Text>
        
        <View className="w-full max-w-md mb-6">
          <Link href="/workouts" asChild>
            <Pressable>
              <View className="bg-card p-6 rounded-xl border border-border mb-4">
                <Text className="text-lg font-semibold text-text mb-2">Workouts</Text>
                <Text className="text-textSecondary">Create and manage your personalized workout routines.</Text>
              </View>
            </Pressable>
          </Link>
          
          <Link href="/exercises" asChild>
            <Pressable>
              <View className="bg-card p-6 rounded-xl border border-border mb-4">
                <Text className="text-lg font-semibold text-text mb-2">Exercise Library</Text>
                <Text className="text-textSecondary">Browse our comprehensive collection of exercises.</Text>
              </View>
            </Pressable>
          </Link>
          
          <Link href="/progress" asChild>
            <Pressable>
              <View className="bg-card p-6 rounded-xl border border-border mb-4">
                <Text className="text-lg font-semibold text-text mb-2">Progress</Text>
                <Text className="text-textSecondary">Track your fitness journey with detailed statistics.</Text>
              </View>
            </Pressable>
          </Link>
          
          <Link href="/profile" asChild>
            <Pressable>
              <View className="bg-card p-6 rounded-xl border border-border">
                <Text className="text-lg font-semibold text-text mb-2">Profile</Text>
                <Text className="text-textSecondary">Manage your personal information and settings.</Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
