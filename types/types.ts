// types.ts o interfaces.ts
export interface Exercise {
  id: number
  name: string
  muscle_group: string
  exercise_type: string
  image: string
}

export interface Workout {
  id: number
  name: string
  day: string
  image: string
}

export interface WorkoutExercise {
  id: number
  workout_id: number
  exercise_id: number
  sets: string
  reps: string
  rest: number
  notes: string
  series_type: string
}

export interface ProgressData {
  id: number
  exercise_id: number
  weight: number
  reps: number
  date: string
  notes: string
}

export interface User {
  id: number
  name: string
  email: string
  weight: number
  age: number
  height: number
}

export interface UserWeightProgress {
  id: number
  weight: number
  date: string
}

export interface AuthState {
  id: number
  is_signed_in: boolean
  email: string
  display_name: string
  photo_url: string
  last_updated: string
}
