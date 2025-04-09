import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    // Load saved user from AsyncStorage
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      // Replace with your actual authentication logic
      // This is just a placeholder implementation
      const mockUser = { id: '1', email, name: 'Test User' };
      
      // Save user to state and storage
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear user from state and storage
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  // Register function
  const register = async (email, password, name) => {
    try {
      // Replace with your actual registration logic
      // This is just a placeholder implementation
      const mockUser = { id: '1', email, name };
      
      // Save user to state and storage
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Context value
  const authContextValue = {
    user,
    isLoading,
    signIn,
    signOut,
    register,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 