// mockData.js

export const exercises = [
  {
    id: 1,
    name: 'Push Up',
    muscle_group: 'Chest',
    exercise_type: 'Bodyweight',
    image: 'https://example.com/images/pushup.png'
  },
  {
    id: 2,
    name: 'Squat',
    muscle_group: 'Legs',
    exercise_type: 'Bodyweight',
    image: 'https://example.com/images/squat.png'
  },
  {
    id: 3,
    name: 'Bicep Curl',
    muscle_group: 'Arms',
    exercise_type: 'Dumbbell',
    image: 'https://example.com/images/bicep_curl.png'
  }
]

export const workouts = [
  {
    id: 1,
    name: 'Full Body Workout',
    day: 'Monday',
    image: 'https://example.com/images/fullbody.png'
  },
  {
    id: 2,
    name: 'Upper Body Workout',
    day: 'Thursday',
    image: 'https://example.com/images/upperbody.png'
  }
]

export const workoutExercises = [
  {
    id: 1,
    workout_id: 1,
    exercise_id: 1,
    sets: '3',
    reps: '12',
    rest: 60,
    notes: 'Keep your back straight',
    series_type: 'Regular'
  },
  {
    id: 2,
    workout_id: 1,
    exercise_id: 2,
    sets: '3',
    reps: '15',
    rest: 90,
    notes: 'Knees alineados con los pies',
    series_type: 'Regular'
  },
  {
    id: 3,
    workout_id: 2,
    exercise_id: 3,
    sets: '4',
    reps: '10',
    rest: 45,
    notes: 'Controla el movimiento',
    series_type: 'Drop Set'
  }
]

export const progressData = [
  {
    id: 1,
    exercise_id: 1,
    weight: 0, // Ejercicio de peso corporal
    reps: 12,
    date: '2025-01-01',
    notes: 'Buena forma'
  },
  {
    id: 2,
    exercise_id: 3,
    weight: 12.5,
    reps: 10,
    date: '2025-01-02',
    notes: 'Incremento de peso desafiante'
  },
  {
    id: 3,
    exercise_id: 2,
    weight: 0, // Ejercicio de peso corporal
    reps: 15,
    date: '2025-01-03',
    notes: 'Piernas fuertes'
  }
]

export const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    weight: 75.5,
    age: 28,
    height: 175.0
  }
]

export const userWeightProgress = [
  {
    id: 1,
    weight: 75.5,
    date: '2025-01-01'
  },
  {
    id: 2,
    weight: 75.0,
    date: '2025-02-01'
  }
]

export const authStates = [
  {
    id: 1,
    is_signed_in: true, // Recuerda que en la base de datos se almacena como 1 (true) o 0 (false)
    email: 'john@example.com',
    display_name: 'JohnD',
    photo_url: 'https://example.com/profiles/john.png',
    last_updated: '2025-01-05'
  }
]
