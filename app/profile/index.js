import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';

// Mock user data
const MOCK_USER = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  joinDate: 'March 2025',
  stats: {
    workoutsCompleted: 24,
    totalMinutes: 840,
    achievements: 8
  },
  goals: {
    primary: 'Build Muscle',
    workoutsPerWeek: 4,
    currentStreak: 5
  }
};

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Profile Header */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4 items-center">
          {/* Profile Image Placeholder */}
          <View className="w-24 h-24 rounded-full bg-primary mb-3 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          
          <Text className="text-text text-xl font-bold">{MOCK_USER.name}</Text>
          <Text className="text-textSecondary mb-2">{MOCK_USER.email}</Text>
          <Text className="text-textSecondary text-xs">Member since {MOCK_USER.joinDate}</Text>
          
          <TouchableOpacity className="bg-background border border-border px-4 py-2 rounded-full mt-3">
            <Text className="text-primary">Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Your Stats</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-primary text-xl font-bold">{MOCK_USER.stats.workoutsCompleted}</Text>
              <Text className="text-textSecondary text-xs">Workouts</Text>
            </View>
            <View className="items-center">
              <Text className="text-primary text-xl font-bold">{MOCK_USER.stats.totalMinutes}</Text>
              <Text className="text-textSecondary text-xs">Minutes</Text>
            </View>
            <View className="items-center">
              <Text className="text-primary text-xl font-bold">{MOCK_USER.stats.achievements}</Text>
              <Text className="text-textSecondary text-xs">Achievements</Text>
            </View>
          </View>
        </View>
        
        {/* Goals Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Your Goals</Text>
          <View className="mb-3">
            <Text className="text-textSecondary mb-1">Primary Goal</Text>
            <Text className="text-text font-semibold">{MOCK_USER.goals.primary}</Text>
          </View>
          <View className="mb-3">
            <Text className="text-textSecondary mb-1">Weekly Workout Target</Text>
            <Text className="text-text font-semibold">{MOCK_USER.goals.workoutsPerWeek} workouts per week</Text>
          </View>
          <View>
            <Text className="text-textSecondary mb-1">Current Streak</Text>
            <Text className="text-text font-semibold">{MOCK_USER.goals.currentStreak} days</Text>
          </View>
          
          <TouchableOpacity className="bg-background border border-border p-2 rounded-lg mt-3 items-center">
            <Text className="text-primary">Update Goals</Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Links */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Quick Links</Text>
          
          <Link href="/profile/settings" asChild>
            <TouchableOpacity>
              <View className="bg-card p-4 rounded-xl border border-border mb-2 flex-row justify-between items-center">
                <Text className="text-text">Settings</Text>
                <Text className="text-textSecondary">›</Text>
              </View>
            </TouchableOpacity>
          </Link>
          
          <TouchableOpacity>
            <View className="bg-card p-4 rounded-xl border border-border mb-2 flex-row justify-between items-center">
              <Text className="text-text">Achievements</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <View className="bg-card p-4 rounded-xl border border-border mb-2 flex-row justify-between items-center">
              <Text className="text-text">Help & Support</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <View className="bg-card p-4 rounded-xl border border-border flex-row justify-between items-center">
              <Text className="text-error">Sign Out</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
