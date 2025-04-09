import { View, Text } from 'react-native';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// AuthGuard component to protect routes
function AuthGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Skip when loading
    if (isLoading) return;

    // Check if the path is in the auth group
    const inAuthGroup = segments[0] === 'auth';

    // If not signed in and not in auth group, redirect to login
    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } 
    // If signed in and in auth group, redirect to home
    else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, segments, isLoading]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-text">Loading...</Text>
      </View>
    );
  }

  // Render the child routes
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="workouts" options={{ headerShown: false }} />
        <Stack.Screen name="exercises" options={{ headerShown: false }} />
        <Stack.Screen name="progress" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}
