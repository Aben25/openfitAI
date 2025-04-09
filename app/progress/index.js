import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useTracking } from '../../src/context/TrackingContext';
import { useAuth } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

export default function ProgressScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { 
    bodyWeightHistory, 
    personalRecords, 
    isLoading, 
    error,
    getBodyWeightHistory,
    addBodyWeightRecord,
    getProgressPhotos,
    uploadProgressPhoto,
    getPersonalRecords
  } = useTracking();
  
  const [activeTab, setActiveTab] = useState('weight');
  const [newWeight, setNewWeight] = useState('');
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [photoNote, setPhotoNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      await getBodyWeightHistory();
      await getPersonalRecords();
      const photos = await getProgressPhotos();
      setProgressPhotos(photos);
    };
    
    loadData();
  }, []);
  
  // Handle adding new weight record
  const handleAddWeight = async () => {
    if (!newWeight.trim()) {
      Alert.alert('Error', 'Please enter a weight value');
      return;
    }
    
    try {
      const weightValue = parseFloat(newWeight);
      if (isNaN(weightValue) || weightValue <= 0) {
        Alert.alert('Error', 'Please enter a valid weight value');
        return;
      }
      
      await addBodyWeightRecord(weightValue);
      setNewWeight('');
      Alert.alert('Success', 'Weight record added successfully');
    } catch (error) {
      console.error('Error adding weight record:', error);
      Alert.alert('Error', 'Failed to add weight record');
    }
  };
  
  // Handle taking a new progress photo
  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take photos');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleUploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Handle selecting a photo from library
  const handleSelectPhoto = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need media library permissions to select photos');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleUploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };
  
  // Handle uploading a photo
  const handleUploadPhoto = async (uri) => {
    setIsUploading(true);
    try {
      const result = await uploadProgressPhoto(uri, photoNote);
      if (result) {
        // Refresh progress photos
        const photos = await getProgressPhotos();
        setProgressPhotos(photos);
        setPhotoNote('');
        Alert.alert('Success', 'Progress photo uploaded successfully');
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload progress photo');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Render weight history tab
  const renderWeightTab = () => {
    return (
      <View>
        {/* Add New Weight Record */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Add Weight Record</Text>
          
          <View className="flex-row mb-4">
            <TextInput
              className="flex-1 bg-background text-text p-3 rounded-lg border border-border mr-2"
              placeholder={`Weight in ${userProfile?.weight_unit || 'kg'}`}
              placeholderTextColor="#757575"
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              className="bg-primary px-4 rounded-lg justify-center"
              onPress={handleAddWeight}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">Add</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-textSecondary text-xs">
            Enter your current weight to track your progress over time.
          </Text>
        </View>
        
        {/* Weight History */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-4">Weight History</Text>
          
          {bodyWeightHistory.length > 0 ? (
            <View>
              {/* Weight History Headers */}
              <View className="flex-row mb-2 px-2">
                <Text className="flex-1 text-textSecondary font-medium">Date</Text>
                <Text className="w-20 text-textSecondary font-medium text-right">
                  Weight ({userProfile?.weight_unit || 'kg'})
                </Text>
              </View>
              
              {/* Weight History Items */}
              {bodyWeightHistory.map((record, index) => (
                <View 
                  key={record.id || index} 
                  className={`flex-row items-center p-3 rounded-lg ${
                    index % 2 === 0 ? 'bg-background' : ''
                  }`}
                >
                  <Text className="flex-1 text-text">{formatDate(record.date)}</Text>
                  <Text className="w-20 text-text text-right font-medium">{record.weight}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-background p-4 rounded-lg items-center">
              <Text className="text-textSecondary">No weight records yet</Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Render photos tab
  const renderPhotosTab = () => {
    return (
      <View>
        {/* Add New Photo */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Add Progress Photo</Text>
          
          <TextInput
            className="bg-background text-text p-3 rounded-lg border border-border mb-3"
            placeholder="Add a note (optional)"
            placeholderTextColor="#757575"
            value={photoNote}
            onChangeText={setPhotoNote}
          />
          
          <View className="flex-row justify-between mb-2">
            <TouchableOpacity 
              className="flex-1 bg-primary py-3 rounded-lg mr-2 items-center"
              onPress={handleTakePhoto}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">Take Photo</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-background border border-primary py-3 rounded-lg items-center"
              onPress={handleSelectPhoto}
              disabled={isUploading}
            >
              <Text className="text-primary font-semibold">Select Photo</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-textSecondary text-xs">
            Take regular photos to visually track your fitness progress.
          </Text>
        </View>
        
        {/* Progress Photos */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-4">Progress Photos</Text>
          
          {progressPhotos.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              {progressPhotos.map((photo, index) => (
                <TouchableOpacity 
                  key={photo.id || index}
                  className="w-[48%] aspect-square mb-3 rounded-lg overflow-hidden"
                  onPress={() => router.push(`/progress/photo/${photo.id}`)}
                >
                  <Image
                    source={{ uri: photo.photo_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <Text className="text-white text-xs">{formatDate(photo.date)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-background p-4 rounded-lg items-center">
              <Text className="text-textSecondary">No progress photos yet</Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Render personal records tab
  const renderRecordsTab = () => {
    // Convert personal records object to array for rendering
    const recordsArray = Object.values(personalRecords);
    
    return (
      <View>
        {/* Personal Records */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-4">Personal Records</Text>
          
          {recordsArray.length > 0 ? (
            <View>
              {/* Records Headers */}
              <View className="flex-row mb-2 px-2">
                <Text className="flex-1 text-textSecondary font-medium">Exercise</Text>
                <Text className="w-20 text-textSecondary font-medium text-center">Weight</Text>
                <Text className="w-16 text-textSecondary font-medium text-center">Reps</Text>
                <Text className="w-24 text-textSecondary font-medium text-right">Date</Text>
              </View>
              
              {/* Records Items */}
              {recordsArray.map((record, index) => (
                <View 
                  key={record.id || index} 
                  className={`flex-row items-center p-3 rounded-lg ${
                    index % 2 === 0 ? 'bg-background' : ''
                  }`}
                >
                  <Text className="flex-1 text-text">{record.exercise_name}</Text>
                  <Text className="w-20 text-text text-center font-medium">{record.weight}</Text>
                  <Text className="w-16 text-text text-center">{record.reps}</Text>
                  <Text className="w-24 text-text text-right">{formatDate(record.date)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-background p-4 rounded-lg items-center">
              <Text className="text-textSecondary">No personal records yet</Text>
              <Text className="text-textSecondary text-xs mt-2 text-center">
                Complete workouts to start tracking your personal records
              </Text>
            </View>
          )}
        </View>
        
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">About Personal Records</Text>
          <Text className="text-textSecondary">
            Personal records are automatically tracked when you complete sets during workouts.
            A new record is set when you lift more weight than your previous best for a given exercise.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Progress' }} />
      
      <View className="p-4">
        {/* Tabs */}
        <View className="flex-row bg-card rounded-lg mb-4 p-1">
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'weight' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('weight')}
          >
            <Text className={`text-center ${activeTab === 'weight' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'photos' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('photos')}
          >
            <Text className={`text-center ${activeTab === 'photos' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Photos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-2 rounded-md ${activeTab === 'records' ? 'bg-primary' : ''}`}
            onPress={() => setActiveTab('records')}
          >
            <Text className={`text-center ${activeTab === 'records' ? 'text-white font-semibold' : 'text-textSecondary'}`}>
              Records
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'weight' && renderWeightTab()}
        {activeTab === 'photos' && renderPhotosTab()}
        {activeTab === 'records' && renderRecordsTab()}
      </View>
    </ScrollView>
  );
}
