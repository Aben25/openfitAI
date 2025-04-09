import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getCompletedWorkouts,
  getCompletedWorkoutById,
  logCompletedSet,
  supabase
} from '../lib/workoutApi';
import { useAuth } from './AuthContext';

// Create the tracking context
const TrackingContext = createContext({
  completedWorkouts: [],
  personalRecords: {},
  bodyWeightHistory: [],
  isLoading: false,
  error: null,
  fetchCompletedWorkouts: async () => {},
  fetchCompletedWorkoutById: async () => {},
  logExerciseSet: async () => {},
  uploadProgressPhoto: async () => {},
  getProgressPhotos: async () => {},
  addBodyWeightRecord: async () => {},
  getBodyWeightHistory: async () => {},
  getPersonalRecords: async () => {},
});

// Provider component
export const TrackingProvider = ({ children }) => {
  const { user } = useAuth();
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [personalRecords, setPersonalRecords] = useState({});
  const [bodyWeightHistory, setBodyWeightHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's completed workouts
  const fetchCompletedWorkouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getCompletedWorkouts(user.id);
      
      if (error) throw error;
      
      setCompletedWorkouts(data || []);
    } catch (err) {
      console.error('Error fetching completed workouts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific completed workout by ID
  const fetchCompletedWorkoutById = async (completedWorkoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getCompletedWorkoutById(completedWorkoutId);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching completed workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Log an exercise set
  const logExerciseSet = async (setData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await logCompletedSet(setData);
      
      if (error) throw error;
      
      // Check if this is a personal record
      await checkForPersonalRecord(setData.exercise_id, setData.weight, setData.reps);
      
      return data;
    } catch (err) {
      console.error('Error logging exercise set:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a set is a personal record
  const checkForPersonalRecord = async (exerciseId, weight, reps) => {
    if (!user || !weight || !reps) return;
    
    try {
      // Get previous records for this exercise
      const { data, error } = await supabase
        .from('completed_sets')
        .select('weight, reps')
        .eq('exercise_id', exerciseId)
        .order('weight', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      const isRecord = !data.length || parseFloat(weight) > parseFloat(data[0].weight);
      
      if (isRecord) {
        // Save the new record
        const { error: prError } = await supabase
          .from('personal_records')
          .upsert({
            user_id: user.id,
            exercise_id: exerciseId,
            weight: weight,
            reps: reps,
            date: new Date().toISOString()
          });
        
        if (prError) throw prError;
        
        // Update local state
        await getPersonalRecords();
      }
    } catch (err) {
      console.error('Error checking for personal record:', err);
    }
  };

  // Upload a progress photo
  const uploadProgressPhoto = async (photoUri, notes = '') => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate a unique filename
      const fileName = `${user.id}/${Date.now()}.jpg`;
      
      // Upload the photo to Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('progress_photos')
        .upload(fileName, photoUri);
      
      if (fileError) throw fileError;
      
      // Get the public URL
      const { data: urlData } = await supabase.storage
        .from('progress_photos')
        .getPublicUrl(fileName);
      
      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');
      
      // Save the photo metadata to the database
      const { data, error } = await supabase
        .from('progress_photos')
        .insert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          notes: notes,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error uploading progress photo:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's progress photos
  const getProgressPhotos = async () => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching progress photos:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add a body weight record
  const addBodyWeightRecord = async (weight, date = new Date()) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('body_weight_history')
        .insert({
          user_id: user.id,
          weight: weight,
          date: date.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      await getBodyWeightHistory();
      
      return data;
    } catch (err) {
      console.error('Error adding body weight record:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's body weight history
  const getBodyWeightHistory = async () => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('body_weight_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      setBodyWeightHistory(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching body weight history:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's personal records
  const getPersonalRecords = async () => {
    if (!user) return {};
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*, exercises(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Organize records by exercise
      const records = {};
      data.forEach(record => {
        records[record.exercise_id] = {
          ...record,
          exercise_name: record.exercises.name
        };
      });
      
      setPersonalRecords(records);
      return records;
    } catch (err) {
      console.error('Error fetching personal records:', err);
      setError(err.message);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchCompletedWorkouts();
      getBodyWeightHistory();
      getPersonalRecords();
    } else {
      setCompletedWorkouts([]);
      setBodyWeightHistory([]);
      setPersonalRecords({});
    }
  }, [user]);

  const value = {
    completedWorkouts,
    personalRecords,
    bodyWeightHistory,
    isLoading,
    error,
    fetchCompletedWorkouts,
    fetchCompletedWorkoutById,
    logExerciseSet,
    uploadProgressPhoto,
    getProgressPhotos,
    addBodyWeightRecord,
    getBodyWeightHistory,
    getPersonalRecords,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

// Custom hook to use the tracking context
export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
