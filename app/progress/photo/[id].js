import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { useTracking } from '../../../src/context/TrackingContext';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getProgressPhotos, isLoading } = useTracking();
  
  const [photo, setPhoto] = useState(null);
  
  // Fetch photo details
  useEffect(() => {
    const loadPhoto = async () => {
      if (!id) return;
      
      try {
        const photos = await getProgressPhotos();
        const foundPhoto = photos.find(p => p.id.toString() === id.toString());
        if (foundPhoto) {
          setPhoto(foundPhoto);
        }
      } catch (error) {
        console.error('Error loading photo:', error);
      }
    };
    
    loadPhoto();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (!photo) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-textSecondary">Photo not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-primary py-2 px-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Progress Photo' }} />
      
      <View className="p-4">
        {/* Photo */}
        <View className="bg-card p-2 rounded-xl border border-border mb-4">
          <Image
            source={{ uri: photo.photo_url }}
            className="w-full aspect-square rounded-lg"
            resizeMode="contain"
          />
        </View>
        
        {/* Photo Details */}
        <View className="bg-card p-4 rounded-xl border border-border mb-4">
          <Text className="text-lg font-semibold text-text mb-2">Photo Details</Text>
          
          <View className="mb-2">
            <Text className="text-textSecondary font-medium">Date</Text>
            <Text className="text-text">{formatDate(photo.date)}</Text>
          </View>
          
          {photo.notes && (
            <View>
              <Text className="text-textSecondary font-medium">Notes</Text>
              <Text className="text-text">{photo.notes}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
