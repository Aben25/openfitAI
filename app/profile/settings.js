import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [units, setUnits] = useState('metric');
  
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Appearance Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Appearance</Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text">Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#333333', true: '#5D4FEB' }}
              thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-text">Text Size</Text>
            <View className="flex-row">
              <TouchableOpacity className="bg-background px-3 py-1 rounded-l-full border border-border">
                <Text className="text-textSecondary">A-</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-primary px-3 py-1 rounded-r-full border border-primary">
                <Text className="text-white">A+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Notifications Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Notifications</Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text">Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333333', true: '#5D4FEB' }}
              thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-text">Workout Reminders</Text>
            <Switch
              value={reminders}
              onValueChange={setReminders}
              trackColor={{ false: '#333333', true: '#5D4FEB' }}
              thumbColor={reminders ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>
        
        {/* Units Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Units</Text>
          
          <View className="flex-row mb-3">
            <TouchableOpacity 
              className={`flex-1 py-2 rounded-l-lg border border-r-0 ${units === 'metric' ? 'bg-primary border-primary' : 'bg-background border-border'}`}
              onPress={() => setUnits('metric')}
            >
              <Text className={`text-center ${units === 'metric' ? 'text-white' : 'text-textSecondary'}`}>Metric (kg, cm)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-2 rounded-r-lg border border-l-0 ${units === 'imperial' ? 'bg-primary border-primary' : 'bg-background border-border'}`}
              onPress={() => setUnits('imperial')}
            >
              <Text className={`text-center ${units === 'imperial' ? 'text-white' : 'text-textSecondary'}`}>Imperial (lb, in)</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-textSecondary text-xs">Changes how measurements are displayed throughout the app.</Text>
        </View>
        
        {/* Data & Privacy Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Data & Privacy</Text>
          
          <TouchableOpacity className="mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-text">Export Workout Data</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity className="mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-text">Privacy Policy</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <View className="flex-row justify-between items-center">
              <Text className="text-text">Terms of Service</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Account Section */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-3">Account</Text>
          
          <TouchableOpacity className="mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-text">Change Password</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <View className="flex-row justify-between items-center">
              <Text className="text-error">Delete Account</Text>
              <Text className="text-textSecondary">›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* App Info */}
        <View className="items-center mb-8">
          <Text className="text-textSecondary">FitTrack v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
