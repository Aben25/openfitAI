import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getCurrentUser, getSession, onAuthStateChange } from '../lib/auth';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

// Provider component that wraps the app and makes auth object available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
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
    signUp: async (email, password) => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
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
        redirectTo: 'https://yourapp.com/reset-password',
      });
      setIsLoading(false);
      return { data, error };
    },
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
