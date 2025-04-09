import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the provided credentials from the plan
const supabaseUrl = 'https://xtazgqpcaujwwaswzeoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YXpncXBjYXVqd3dhc3d6ZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTA5MDUsImV4cCI6MjA0NzM4NjkwNX0.nFutcV81_Na8L-wwxFRpYg7RhqmjMrYspP2LyKbE_q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata // Store additional user metadata
    }
  });
  
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'exp://localhost:19000/auth/reset-password',
  });
  
  return { data, error };
};

// Social authentication functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  return { data, error };
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });
  
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Profile management functions
export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { 
        id: userId,
        ...profileData
      }
    ]);
  
  return { data, error };
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId);
  
  return { data, error };
};
