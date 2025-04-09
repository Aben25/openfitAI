import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getWorkouts, 
  getWorkoutById, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout,
  getExercises,
  addExerciseToWorkout,
  updateWorkoutExercise,
  removeExerciseFromWorkout,
  startWorkout,
  completeWorkout
} from '../lib/workoutApi';
import { useAuth } from './AuthContext';

// Create the workout context
const WorkoutContext = createContext({
  workouts: [],
  recommendedWorkouts: [],
  isLoading: false,
  error: null,
  fetchWorkouts: async () => {},
  fetchWorkoutById: async () => {},
  createNewWorkout: async () => {},
  updateExistingWorkout: async () => {},
  deleteExistingWorkout: async () => {},
  fetchExercises: async () => {},
  addExerciseToWorkout: async () => {},
  updateWorkoutExercise: async () => {},
  removeExerciseFromWorkout: async () => {},
  startWorkoutSession: async () => {},
  completeWorkoutSession: async () => {},
  getRecommendedWorkouts: async () => {},
});

// Provider component
export const WorkoutProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's workouts
  const fetchWorkouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getWorkouts(user.id);
      
      if (error) throw error;
      
      setWorkouts(data || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific workout by ID
  const fetchWorkoutById = async (workoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getWorkoutById(workoutId);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new workout
  const createNewWorkout = async (workoutData) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user_id to workout data
      const fullWorkoutData = {
        ...workoutData,
        user_id: user.id,
      };
      
      const { data, error } = await createWorkout(fullWorkoutData);
      
      if (error) throw error;
      
      // Update local workouts state
      setWorkouts(prevWorkouts => [...prevWorkouts, data]);
      
      return data;
    } catch (err) {
      console.error('Error creating workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing workout
  const updateExistingWorkout = async (workoutId, workoutData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updateWorkout(workoutId, workoutData);
      
      if (error) throw error;
      
      // Update local workouts state
      setWorkouts(prevWorkouts => 
        prevWorkouts.map(workout => 
          workout.id === workoutId ? data : workout
        )
      );
      
      return data;
    } catch (err) {
      console.error('Error updating workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an existing workout
  const deleteExistingWorkout = async (workoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await deleteWorkout(workoutId);
      
      if (error) throw error;
      
      // Update local workouts state
      setWorkouts(prevWorkouts => 
        prevWorkouts.filter(workout => workout.id !== workoutId)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch exercises with optional filters
  const fetchExercises = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getExercises(filters);
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add exercise to workout
  const addExerciseToWorkoutFn = async (workoutId, exerciseData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const workoutExerciseData = {
        workout_id: workoutId,
        exercise_id: exerciseData.exerciseId,
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight: exerciseData.weight,
        rest_time: exerciseData.restTime,
        order: exerciseData.order,
      };
      
      const { data, error } = await addExerciseToWorkout(workoutExerciseData);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error adding exercise to workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update workout exercise
  const updateWorkoutExerciseFn = async (workoutExerciseId, exerciseData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updateWorkoutExercise(workoutExerciseId, exerciseData);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error updating workout exercise:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove exercise from workout
  const removeExerciseFromWorkoutFn = async (workoutExerciseId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await removeExerciseFromWorkout(workoutExerciseId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error removing exercise from workout:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start a workout session
  const startWorkoutSession = async (workoutId) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await startWorkout(workoutId, user.id);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error starting workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a workout session
  const completeWorkoutSession = async (completedWorkoutId, completionData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await completeWorkout(completedWorkoutId, completionData);
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error completing workout:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommended workouts based on user profile
  const getRecommendedWorkouts = async () => {
    if (!user || !userProfile) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a server function to get personalized recommendations
      // For now, we'll simulate this with a filter based on user profile data
      
      // Get all workouts (in a real app, this would be template workouts, not user workouts)
      const { data, error } = await getWorkouts(null); // Passing null to get template workouts
      
      if (error) throw error;
      
      // Filter workouts based on user profile
      let filtered = data || [];
      
      // Example: Filter by fitness level
      if (userProfile.cardio_level !== undefined && userProfile.weightlifting_level !== undefined) {
        const avgLevel = (userProfile.cardio_level + userProfile.weightlifting_level) / 2;
        
        // Map 0-4 scale to beginner/intermediate/advanced
        let difficultyFilter;
        if (avgLevel < 1.5) difficultyFilter = 'beginner';
        else if (avgLevel < 3) difficultyFilter = 'intermediate';
        else difficultyFilter = 'advanced';
        
        filtered = filtered.filter(w => w.difficulty === difficultyFilter);
      }
      
      // Example: Filter by workout environment
      if (userProfile.workout_environments && userProfile.workout_environments.length > 0) {
        const environments = userProfile.workout_environments.map(env => env.id);
        filtered = filtered.filter(w => environments.includes(w.environment));
      }
      
      // Example: Filter by fitness goals
      if (userProfile.fitness_goals && userProfile.fitness_goals.length > 0) {
        const goals = userProfile.fitness_goals.map(goal => goal.id);
        filtered = filtered.filter(w => w.goal && goals.includes(w.goal));
      }
      
      setRecommendedWorkouts(filtered);
      return filtered;
    } catch (err) {
      console.error('Error getting recommended workouts:', err);
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load workouts when user changes
  useEffect(() => {
    if (user) {
      fetchWorkouts();
      getRecommendedWorkouts();
    } else {
      setWorkouts([]);
      setRecommendedWorkouts([]);
    }
  }, [user]);

  const value = {
    workouts,
    recommendedWorkouts,
    isLoading,
    error,
    fetchWorkouts,
    fetchWorkoutById,
    createNewWorkout,
    updateExistingWorkout,
    deleteExistingWorkout,
    fetchExercises,
    addExerciseToWorkout: addExerciseToWorkoutFn,
    updateWorkoutExercise: updateWorkoutExerciseFn,
    removeExerciseFromWorkout: removeExerciseFromWorkoutFn,
    startWorkoutSession,
    completeWorkoutSession,
    getRecommendedWorkouts,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
