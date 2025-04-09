import React, { createContext, useState, useEffect, useContext } from 'react';
import { getExercises, getExerciseById, addExerciseToWorkout, updateWorkoutExercise, removeExerciseFromWorkout } from '../lib/workoutApi';
import { useAuth } from './AuthContext';

// Create the exercise context
const ExerciseContext = createContext({
  exercises: [],
  categories: [],
  equipment: [],
  isLoading: false,
  error: null,
  fetchExercises: async () => {},
  fetchExerciseById: async () => {},
  addExerciseToWorkout: async () => {},
  updateWorkoutExercise: async () => {},
  removeExerciseFromWorkout: async () => {},
  searchExercises: async () => {},
});

// Provider component that wraps the app and makes exercise data available
export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch exercises when component mounts
  useEffect(() => {
    fetchExercises();
  }, []);

  // Extract unique categories and equipment from exercises
  useEffect(() => {
    if (exercises.length > 0) {
      const uniqueCategories = [...new Set(exercises.map(ex => ex.category))].filter(Boolean);
      const uniqueEquipment = [...new Set(exercises.map(ex => ex.equipment))].filter(Boolean);
      
      setCategories(uniqueCategories);
      setEquipment(uniqueEquipment);
    }
  }, [exercises]);

  const fetchExercises = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getExercises(filters);
      
      if (apiError) {
        setError(apiError.message);
      } else {
        setExercises(data || []);
      }
    } catch (err) {
      setError('Failed to fetch exercises');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExerciseById = async (exerciseId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getExerciseById(exerciseId);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to fetch exercise details');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const addExerciseToWorkoutHandler = async (workoutExerciseData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await addExerciseToWorkout(workoutExerciseData);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to add exercise to workout');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkoutExerciseHandler = async (workoutExerciseId, workoutExerciseData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await updateWorkoutExercise(workoutExerciseId, workoutExerciseData);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to update workout exercise');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeExerciseFromWorkoutHandler = async (workoutExerciseId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: apiError } = await removeExerciseFromWorkout(workoutExerciseId);
      
      if (apiError) {
        setError(apiError.message);
        return false;
      } else {
        return true;
      }
    } catch (err) {
      setError('Failed to remove exercise from workout');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const searchExercises = async (searchTerm) => {
    return fetchExercises({ search: searchTerm });
  };

  // Context value
  const value = {
    exercises,
    categories,
    equipment,
    isLoading,
    error,
    fetchExercises,
    fetchExerciseById,
    addExerciseToWorkout: addExerciseToWorkoutHandler,
    updateWorkoutExercise: updateWorkoutExerciseHandler,
    removeExerciseFromWorkout: removeExerciseFromWorkoutHandler,
    searchExercises,
  };

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
};

// Custom hook to use the exercise context
export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};
