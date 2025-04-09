import React, { createContext, useState, useEffect, useContext } from 'react';
import { startWorkout, completeWorkout, logCompletedSet, getCompletedWorkouts, getCompletedWorkoutById } from '../lib/workoutApi';
import { useAuth } from './AuthContext';

// Create the tracking context
const TrackingContext = createContext({
  activeWorkout: null,
  completedWorkouts: [],
  isLoading: false,
  error: null,
  timer: 0,
  isTimerRunning: false,
  startWorkoutSession: async () => {},
  completeWorkoutSession: async () => {},
  logSet: async () => {},
  fetchCompletedWorkouts: async () => {},
  fetchCompletedWorkoutById: async () => {},
  startTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
});

// Provider component that wraps the app and makes tracking data available
export const TrackingProvider = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const { user } = useAuth();

  // Fetch completed workouts when user changes
  useEffect(() => {
    if (user) {
      fetchCompletedWorkouts();
    } else {
      setCompletedWorkouts([]);
    }
  }, [user]);

  // Handle timer
  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setTimerInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isTimerRunning]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  const startWorkoutSession = async (workoutId) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await startWorkout(workoutId, user.id);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        setActiveWorkout(data);
        resetTimer();
        startTimer();
        return data;
      }
    } catch (err) {
      setError('Failed to start workout');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const completeWorkoutSession = async (completionData = {}) => {
    if (!activeWorkout) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add duration from timer
      const dataWithDuration = {
        ...completionData,
        duration: timer
      };
      
      const { data, error: apiError } = await completeWorkout(activeWorkout.id, dataWithDuration);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        // Update local state
        setCompletedWorkouts(prevWorkouts => [data, ...prevWorkouts]);
        setActiveWorkout(null);
        resetTimer();
        return data;
      }
    } catch (err) {
      setError('Failed to complete workout');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logSet = async (setData) => {
    if (!activeWorkout) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure completed_workout_id is set
      const setWithWorkoutId = {
        ...setData,
        completed_workout_id: activeWorkout.id
      };
      
      const { data, error: apiError } = await logCompletedSet(setWithWorkoutId);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to log set');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedWorkouts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getCompletedWorkouts(user.id);
      
      if (apiError) {
        setError(apiError.message);
      } else {
        setCompletedWorkouts(data || []);
      }
    } catch (err) {
      setError('Failed to fetch completed workouts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedWorkoutById = async (completedWorkoutId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: apiError } = await getCompletedWorkoutById(completedWorkoutId);
      
      if (apiError) {
        setError(apiError.message);
        return null;
      } else {
        return data;
      }
    } catch (err) {
      setError('Failed to fetch completed workout details');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    activeWorkout,
    completedWorkouts,
    isLoading,
    error,
    timer,
    isTimerRunning,
    startWorkoutSession,
    completeWorkoutSession,
    logSet,
    fetchCompletedWorkouts,
    fetchCompletedWorkoutById,
    startTimer,
    pauseTimer,
    resetTimer,
  };

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
};

// Custom hook to use the tracking context
export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
