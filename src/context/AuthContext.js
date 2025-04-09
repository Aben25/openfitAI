import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  supabase, 
  getCurrentUser, 
  getSession, 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithApple,
  createUserProfile,
  getUserProfile,
  updateUserProfile
} from '../lib/auth';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  userProfile: null,
  isNewUser: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  updateProfile: async () => {},
  completeOnboarding: async () => {},
});

// Provider component that wraps the app and makes auth object available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    
    const { data, error } = await getUserProfile(userId);
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  };

  useEffect(() => {
    // Check for active session on mount
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { session: currentSession, error: sessionError } = await getSession();
      
      if (currentSession) {
        setSession(currentSession);
        
        // Get user details
        const { user: currentUser, error: userError } = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Get user profile
          const profile = await fetchUserProfile(currentUser.id);
          setUserProfile(profile);
          
          // Check if this is a new user (no profile or incomplete onboarding)
          setIsNewUser(!profile || !profile.onboarding_completed);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        setUser(session.user);
        
        // Get user profile on auth state change
        const profile = await fetchUserProfile(session.user.id);
        setUserProfile(profile);
        
        // Check if this is a new user
        setIsNewUser(!profile || !profile.onboarding_completed);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsNewUser(false);
      }
      
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Auth methods to expose via context
  const value = {
    user,
    session,
    isLoading,
    userProfile,
    isNewUser,
    signUp: async (email, password, name) => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: name }
        }
      });
      
      if (data?.user) {
        // Create initial profile record
        await createUserProfile(data.user.id, {
          full_name: name,
          onboarding_completed: false
        });
        
        setIsNewUser(true);
      }
      
      setIsLoading(false);
      return { data, error };
    },
    signIn: async (email, password) => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setIsLoading(false);
      return { data, error };
    },
    signOut: async () => {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      setIsLoading(false);
      return { error };
    },
    resetPassword: async (email) => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'exp://localhost:19000/auth/reset-password',
      });
      setIsLoading(false);
      return { data, error };
    },
    signInWithGoogle: async () => {
      setIsLoading(true);
      const { data, error } = await signInWithGoogle();
      setIsLoading(false);
      return { data, error };
    },
    signInWithApple: async () => {
      setIsLoading(true);
      const { data, error } = await signInWithApple();
      setIsLoading(false);
      return { data, error };
    },
    updateProfile: async (profileData) => {
      if (!user) return { error: { message: 'No user logged in' } };
      
      setIsLoading(true);
      const { data, error } = await updateUserProfile(user.id, profileData);
      
      if (!error) {
        // Update local profile state
        setUserProfile({ ...userProfile, ...profileData });
      }
      
      setIsLoading(false);
      return { data, error };
    },
    completeOnboarding: async (onboardingData) => {
      if (!user) return { error: { message: 'No user logged in' } };
      
      setIsLoading(true);
      
      // Update profile with onboarding data and mark as completed
      const profileData = {
        ...onboardingData,
        onboarding_completed: true
      };
      
      const { data, error } = await updateUserProfile(user.id, profileData);
      
      if (!error) {
        // Update local profile state
        setUserProfile({ ...userProfile, ...profileData });
        setIsNewUser(false);
      }
      
      setIsLoading(false);
      return { data, error };
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
