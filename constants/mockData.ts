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
  },
  // Upper Body Workout Exercises
  {
    id: 4,
    name: 'Dragon Flag',
    muscle_group: 'Core',
    exercise_type: 'Bodyweight',
    image: 'https://example.com/images/dragon_flag.png'
  },
  {
    id: 5,
    name: 'Elevaciones Laterales',
    muscle_group: 'Shoulders',
    exercise_type: 'Dumbbell',
    image: 'https://example.com/images/elevaciones_laterales.png'
  },
  {
    id: 6,
    name: 'Cruces Sentado',
    muscle_group: 'Chest',
    exercise_type: 'Cable',
    image: 'https://example.com/images/cruces_sentado.png'
  },
  {
    id: 7,
    name: 'Press Inclinado',
    muscle_group: 'Chest',
    exercise_type: 'Dumbbell',
    image: 'https://example.com/images/press_inclinado.png'
  },
  {
    id: 8,
    name: 'Press Muy Inclinado',
    muscle_group: 'Chest',
    exercise_type: 'Smith Machine',
    image: 'https://example.com/images/press_muy_inclinado.png'
  },
  {
    id: 9,
    name: 'Elevaciones Crucifix',
    muscle_group: 'Shoulders',
    exercise_type: 'Cable',
    image: 'https://example.com/images/elevaciones_crucifix.png'
  },
  {
    id: 10,
    name: 'Press Plano Banca',
    muscle_group: 'Chest',
    exercise_type: 'Barbell',
    image: 'https://example.com/images/press_plano.png'
  },
  {
    id: 11,
    name: 'Fondos Lastrados',
    muscle_group: 'Triceps',
    exercise_type: 'Bodyweight',
    image: 'https://example.com/images/fondos_lastrados.png'
  },
  {
    id: 12,
    name: 'Curl Predicador Unilateral',
    muscle_group: 'Biceps',
    exercise_type: 'Machine',
    image: 'https://example.com/images/curl_predicador.png'
  },
  {
    id: 13,
    name: 'Curl Martillo Unilateral',
    muscle_group: 'Biceps',
    exercise_type: 'Cable',
    image: 'https://example.com/images/curl_martillo.png'
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
  },
  {
    id: 3,
    name: 'Leg Day',
    day: 'Wednesday',
    image: 'https://example.com/images/legday.png'
  },
  {
    id: 4,
    name: 'Push Day',
    day: 'Tuesday',
    image: 'https://example.com/images/pushday.png'
  },
  {
    id: 5,
    name: 'Pull Day',
    day: 'Thursday',
    image: 'https://example.com/images/pullday.png'
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
  },
  // Upper Body Workout Exercises
  {
    id: 4,
    workout_id: 2,
    exercise_id: 4,
    sets: '3',
    reps: 'Rectas',
    rest: 60,
    series_type: 'Regular'
  },
  {
    id: 5,
    workout_id: 2,
    exercise_id: 5,
    sets: '1TS + 2BO + DropSet',
    reps: '',
    rest: 60,
    series_type: 'Drop Set'
  },
  {
    id: 6,
    workout_id: 2,
    exercise_id: 6,
    sets: '3',
    reps: 'Rectas',
    rest: 60,
    series_type: 'Regular'
  },
  {
    id: 7,
    workout_id: 2,
    exercise_id: 7,
    sets: '1TS + 1BO',
    reps: '',
    rest: 60,
    series_type: 'Drop Set'
  },
  {
    id: 8,
    workout_id: 2,
    exercise_id: 8,
    sets: '1TS + 2BO',
    reps: '',
    rest: 60,
    series_type: 'Drop Set'
  },
  {
    id: 9,
    workout_id: 2,
    exercise_id: 9,
    sets: '3 + DropSet',
    reps: '',
    rest: 60,
    series_type: 'Drop Set'
  },
  {
    id: 10,
    workout_id: 2,
    exercise_id: 10,
    sets: '1TS + 1BO',
    reps: '',
    rest: 60,
    series_type: 'Drop Set'
  },
  {
    id: 11,
    workout_id: 2,
    exercise_id: 11,
    sets: '2',
    reps: 'Rectas',
    rest: 60,
    series_type: 'Regular'
  },
  {
    id: 12,
    workout_id: 2,
    exercise_id: 12,
    sets: '2 + Rest Pause',
    reps: '',
    rest: 60,
    series_type: 'Rest Pause'
  },
  {
    id: 13,
    workout_id: 2,
    exercise_id: 13,
    sets: '2',
    reps: 'Rectas',
    rest: 60,
    series_type: 'Regular'
  }
]

export const progressData = [
  {
    id: 1,
    exercise_id: 1,
    weight: 0, // Ejercicio de peso corporal (workout 1)
    reps: 12,
    date: '2025-01-01',
    notes: 'Buena forma'
  },
  {
    id: 2,
    exercise_id: 3, // Pertenece a workout 2
    weight: 12.5,
    reps: 10,
    date: '2025-01-02',
    notes: 'Incremento de peso desafiante'
  },
  {
    id: 3,
    exercise_id: 2,
    weight: 0, // Ejercicio de peso corporal (workout 1)
    reps: 15,
    date: '2025-01-03',
    notes: 'Piernas fuertes'
  },
  // --- Datos de progreso para los ejercicios del workout con id 2 ---
  {
    id: 4,
    exercise_id: 4, // Dragon Flag
    weight: 0,
    reps: 8,
    date: '2025-01-04',
    notes: 'Inicio de Dragon Flag'
  },
  {
    id: 5,
    exercise_id: 4, // Dragon Flag (segunda sesión)
    weight: 0,
    reps: 10,
    date: '2025-01-10',
    notes: 'Mejora en la ejecución de Dragon Flag'
  },
  {
    id: 6,
    exercise_id: 5, // Elevaciones Laterales
    weight: 0,
    reps: 12,
    date: '2025-01-05',
    notes: 'Buen rendimiento en elevaciones laterales'
  },
  {
    id: 7,
    exercise_id: 6, // Cruces Sentado
    weight: 0,
    reps: 15,
    date: '2025-01-06',
    notes: 'Ejecución consistente en cruces sentado'
  },
  {
    id: 8,
    exercise_id: 7, // Press Inclinado
    weight: 10,
    reps: 8,
    date: '2025-01-07',
    notes: 'Progreso en press inclinado'
  },
  {
    id: 9,
    exercise_id: 8, // Press Muy Inclinado
    weight: 15,
    reps: 8,
    date: '2025-01-08',
    notes: 'Desafío en press muy inclinado'
  },
  {
    id: 10,
    exercise_id: 9, // Elevaciones Crucifix
    weight: 5,
    reps: 10,
    date: '2025-01-09',
    notes: 'Progreso en elevaciones crucifix'
  },
  {
    id: 11,
    exercise_id: 10, // Press Plano Banca
    weight: 20,
    reps: 6,
    date: '2025-01-10',
    notes: 'Incremento en press plano banca'
  },
  {
    id: 12,
    exercise_id: 11, // Fondos Lastrados
    weight: 0,
    reps: 12,
    date: '2025-01-11',
    notes: 'Buena ejecución en fondos lastrados'
  },
  {
    id: 13,
    exercise_id: 12, // Curl Predicador Unilateral
    weight: 0,
    reps: 10,
    date: '2025-01-12',
    notes: 'Progreso en curl predicador'
  },
  {
    id: 14,
    exercise_id: 13, // Curl Martillo Unilateral
    weight: 0,
    reps: 10,
    date: '2025-01-13',
    notes: 'Consistencia en curl martillo'
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
