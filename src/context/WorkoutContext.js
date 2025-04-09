import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } from '../lib/workoutApi';
import { useAuth } from './AuthContext';

// Create the workout context
const WorkoutContext = createContext({
  workouts: [],
  isLoading: false,
  error: null,
  fetchWorkouts: async () => {},
  fetchWorkoutById: async () => {},
  createNewWorkout: async () => {},
  updateExistingWorkout: async () => {},
  deleteExistingWorkout: async () => {},
});

// Provider component that wraps the app and makes workout data available
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch workouts when user changes
  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
    }
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getWorkouts(user.id);
      
      if (apiError) {
        setError(apiError.message);
      } else {
        setWorkouts(data || []);
      }
    } catch (err) {
      setError('Failed to fetch workouts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkoutById = async (workoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getWorkoutById(workoutId);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to fetch workout details');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewWorkout = async (workoutData) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure user_id is set
      const workoutWithUserId = {
        ...workoutData,
        user_id: user.id
      };
      
      const { data, error: apiError } = await createWorkout(workoutWithUserId);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        // Update local state
        setWorkouts(prevWorkouts => [...prevWorkouts, data]);
        return data;
      }
    } catch (err) {
      setError('Failed to create workout');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingWorkout = async (workoutId, workoutData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await updateWorkout(workoutId, workoutData);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        // Update local state
        setWorkouts(prevWorkouts => 
          prevWorkouts.map(workout => 
            workout.id === workoutId ? data : workout
          )
        );
        return data;
      }
    } catch (err) {
      setError('Failed to update workout');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExistingWorkout = async (workoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: apiError } = await deleteWorkout(workoutId);
      
      if (apiError) {
        setError(apiError.message);
        return false;
      } else {
        // Update local state
        setWorkouts(prevWorkouts => 
          prevWorkouts.filter(workout => workout.id !== workoutId)
        );
        return true;
      }
    } catch (err) {
      setError('Failed to delete workout');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    fetchWorkoutById,
    createNewWorkout,
    updateExistingWorkout,
    deleteExistingWorkout,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
