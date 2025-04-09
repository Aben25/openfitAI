import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the provided credentials
const supabaseUrl = 'https://xtazgqpcaujwwaswzeoh.supabase.co';
const supabaseAnonKey = 'sbp_c387ac9ed17801fbf7899a2407179d1f294d71fd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Workout-related functions
export const getWorkouts = async (userId) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, exercises(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getWorkoutById = async (workoutId) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, exercises(*))')
    .eq('id', workoutId)
    .single();
  
  return { data, error };
};

export const createWorkout = async (workoutData) => {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workoutData)
    .select()
    .single();
  
  return { data, error };
};

export const updateWorkout = async (workoutId, workoutData) => {
  const { data, error } = await supabase
    .from('workouts')
    .update(workoutData)
    .eq('id', workoutId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteWorkout = async (workoutId) => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);
  
  return { error };
};

// Exercise-related functions
export const getExercises = async (filters = {}) => {
  let query = supabase
    .from('exercises')
    .select('*');
  
  // Apply filters if provided
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.equipment) {
    query = query.eq('equipment', filters.equipment);
  }
  
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }
  
  const { data, error } = await query.order('name');
  
  return { data, error };
};

export const getExerciseById = async (exerciseId) => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .single();
  
  return { data, error };
};

// Workout Exercise functions
export const addExerciseToWorkout = async (workoutExerciseData) => {
  const { data, error } = await supabase
    .from('workout_exercises')
    .insert(workoutExerciseData)
    .select()
    .single();
  
  return { data, error };
};

export const updateWorkoutExercise = async (workoutExerciseId, workoutExerciseData) => {
  const { data, error } = await supabase
    .from('workout_exercises')
    .update(workoutExerciseData)
    .eq('id', workoutExerciseId)
    .select()
    .single();
  
  return { data, error };
};

export const removeExerciseFromWorkout = async (workoutExerciseId) => {
  const { error } = await supabase
    .from('workout_exercises')
    .delete()
    .eq('id', workoutExerciseId);
  
  return { error };
};

// Workout Tracking functions
export const startWorkout = async (workoutId, userId) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .insert({
      workout_id: workoutId,
      user_id: userId,
      start_time: new Date().toISOString(),
      is_completed: false
    })
    .select()
    .single();
  
  return { data, error };
};

export const completeWorkout = async (completedWorkoutId, completionData) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .update({
      ...completionData,
      end_time: new Date().toISOString(),
      is_completed: true
    })
    .eq('id', completedWorkoutId)
    .select()
    .single();
  
  return { data, error };
};

export const logCompletedSet = async (setData) => {
  const { data, error } = await supabase
    .from('completed_sets')
    .insert(setData)
    .select()
    .single();
  
  return { data, error };
};

export const getCompletedWorkouts = async (userId) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .select('*, workouts(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getCompletedWorkoutById = async (completedWorkoutId) => {
  const { data, error } = await supabase
    .from('completed_workouts')
    .select('*, workouts(*), completed_sets(*)')
    .eq('id', completedWorkoutId)
    .single();
  
  return { data, error };
};
