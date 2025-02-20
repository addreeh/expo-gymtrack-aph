import * as SQLite from 'expo-sqlite'
import { Exercise, Workout, WorkoutExercise, ProgressData } from '@/types/types'
import {
  exercises,
  workouts,
  workoutExercises,
  progressData
} from '@/constants/mockData'

// Conexión a la base de datos - ahora asíncrona
let dbPromise: Promise<SQLite.SQLiteDatabase>

// Inicializar la base de datos
export const initDatabase = async (): Promise<void> => {
  dbPromise = SQLite.openDatabaseAsync('gymtrack.db')
  const db = await dbPromise

  // Ejecutar la creación de tablas en una transacción
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      day TEXT NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      sets TEXT NOT NULL,
      reps TEXT NOT NULL,
      rest INTEGER NOT NULL,
      notes TEXT,
      series_type TEXT NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
    );
  `)
}

// Migrar datos de ejemplo a la base de datos
export const migrateMockData = async (): Promise<void> => {
  const db = await dbPromise

  // Usar withTransactionAsync para realizar todas las inserciones en una transacción
  await db.withTransactionAsync(async () => {
    // Insertar ejercicios
    for (const exercise of exercises) {
      await db.runAsync(
        'INSERT OR IGNORE INTO exercises (id, name, muscle_group, exercise_type, image) VALUES (?, ?, ?, ?, ?)',
        [
          exercise.id,
          exercise.name,
          exercise.muscle_group,
          exercise.exercise_type,
          exercise.image
        ]
      )
    }

    // Insertar rutinas
    for (const workout of workouts) {
      await db.runAsync(
        'INSERT OR IGNORE INTO workouts (id, name, day, image) VALUES (?, ?, ?, ?)',
        [workout.id, workout.name, workout.day, workout.image]
      )
    }

    // Insertar ejercicios de rutinas
    for (const we of workoutExercises) {
      await db.runAsync(
        'INSERT OR IGNORE INTO workout_exercises (id, workout_id, exercise_id, sets, reps, rest, notes, series_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          we.id,
          we.workout_id,
          we.exercise_id,
          we.sets,
          we.reps,
          we.rest,
          we.notes || '',
          we.series_type
        ]
      )
    }

    // Insertar datos de progreso
    for (const progress of progressData) {
      await db.runAsync(
        'INSERT OR IGNORE INTO progress (id, exercise_id, weight, reps, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [
          progress.id,
          progress.exercise_id,
          progress.weight,
          progress.reps,
          progress.date,
          progress.notes
        ]
      )
    }
  })
}

// =================== OPERACIONES PARA WORKOUTS ===================

export const getWorkouts = async (): Promise<Workout[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Workout>('SELECT * FROM workouts ORDER BY id ASC')
}

export const getWorkout = async (id: number): Promise<Workout> => {
  const db = await dbPromise
  return await db.getFirstAsync<Workout>(
    'SELECT * FROM workouts WHERE id = ?',
    id
  )
}

export const createWorkout = async (
  workout: Omit<Workout, 'id'>
): Promise<number> => {
  const db = await dbPromise
  const result = await db.runAsync(
    'INSERT INTO workouts (name, day, image) VALUES (?, ?, ?)',
    [workout.name, workout.day, workout.image]
  )
  return result.lastInsertRowId
}

export const updateWorkout = async (workout: Workout): Promise<void> => {
  const db = await dbPromise
  await db.runAsync(
    'UPDATE workouts SET name = ?, day = ?, image = ? WHERE id = ?',
    [workout.name, workout.day, workout.image, workout.id]
  )
}

export const deleteWorkout = async (id: number): Promise<void> => {
  const db = await dbPromise
  await db.runAsync('DELETE FROM workouts WHERE id = ?', [id])
}

// =================== OPERACIONES PARA EXERCISES ===================

export const getExercises = async (): Promise<Exercise[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises ORDER BY name ASC'
  )
}

export const getExercisesByMuscleGroup = async (
  muscleGroup: string
): Promise<Exercise[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name ASC',
    muscleGroup
  )
}

export const getExercise = async (id: number): Promise<Exercise> => {
  const db = await dbPromise
  return await db.getFirstAsync<Exercise>(
    'SELECT * FROM exercises WHERE id = ?',
    id
  )
}

export const createExercise = async (
  exercise: Omit<Exercise, 'id'>
): Promise<number> => {
  const db = await dbPromise
  const result = await db.runAsync(
    'INSERT INTO exercises (name, muscle_group, exercise_type, image) VALUES (?, ?, ?, ?)',
    [
      exercise.name,
      exercise.muscle_group,
      exercise.exercise_type,
      exercise.image
    ]
  )
  return result.lastInsertRowId
}

export const updateExercise = async (exercise: Exercise): Promise<void> => {
  const db = await dbPromise
  await db.runAsync(
    'UPDATE exercises SET name = ?, muscle_group = ?, exercise_type = ?, image = ? WHERE id = ?',
    [
      exercise.name,
      exercise.muscle_group,
      exercise.exercise_type,
      exercise.image,
      exercise.id
    ]
  )
}

export const deleteExercise = async (id: number): Promise<void> => {
  const db = await dbPromise
  await db.runAsync('DELETE FROM exercises WHERE id = ?', [id])
}

// =================== OPERACIONES PARA WORKOUT_EXERCISES ===================

export const getWorkoutExercises = async (
  workoutId: number
): Promise<(WorkoutExercise & Exercise)[]> => {
  const db = await dbPromise
  return await db.getAllAsync<WorkoutExercise & Exercise>(
    `SELECT we.*, e.name, e.muscle_group, e.exercise_type, e.image
     FROM workout_exercises we
     JOIN exercises e ON we.exercise_id = e.id
     WHERE we.workout_id = ?
     ORDER BY we.id ASC`,
    workoutId
  )
}

export const addExerciseToWorkout = async (
  workoutExercise: Omit<WorkoutExercise, 'id'>
): Promise<number> => {
  const db = await dbPromise
  const result = await db.runAsync(
    'INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest, notes, series_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      workoutExercise.workout_id,
      workoutExercise.exercise_id,
      workoutExercise.sets,
      workoutExercise.reps,
      workoutExercise.rest,
      workoutExercise.notes,
      workoutExercise.series_type
    ]
  )
  return result.lastInsertRowId
}

export const updateWorkoutExercise = async (
  workoutExercise: WorkoutExercise
): Promise<void> => {
  const db = await dbPromise
  await db.runAsync(
    'UPDATE workout_exercises SET sets = ?, reps = ?, rest = ?, notes = ?, series_type = ? WHERE id = ?',
    [
      workoutExercise.sets,
      workoutExercise.reps,
      workoutExercise.rest,
      workoutExercise.notes,
      workoutExercise.series_type,
      workoutExercise.id
    ]
  )
}

export const removeExerciseFromWorkout = async (id: number): Promise<void> => {
  const db = await dbPromise
  await db.runAsync('DELETE FROM workout_exercises WHERE id = ?', [id])
}

// =================== OPERACIONES PARA PROGRESS ===================

export const getExerciseProgress = async (
  exerciseId: number
): Promise<ProgressData[]> => {
  const db = await dbPromise
  return await db.getAllAsync<ProgressData>(
    'SELECT * FROM progress WHERE exercise_id = ? ORDER BY date DESC',
    exerciseId
  )
}

export const addProgressEntry = async (
  progress: Omit<ProgressData, 'id'>
): Promise<number> => {
  const db = await dbPromise
  const result = await db.runAsync(
    'INSERT INTO progress (exercise_id, weight, reps, date, notes) VALUES (?, ?, ?, ?, ?)',
    [
      progress.exercise_id,
      progress.weight,
      progress.reps,
      progress.date,
      progress.notes
    ]
  )
  return result.lastInsertRowId
}

export const updateProgressEntry = async (
  progress: ProgressData
): Promise<void> => {
  const db = await dbPromise
  await db.runAsync(
    'UPDATE progress SET weight = ?, reps = ?, date = ?, notes = ? WHERE id = ?',
    [progress.weight, progress.reps, progress.date, progress.notes, progress.id]
  )
}

export const deleteProgressEntry = async (id: number): Promise<void> => {
  const db = await dbPromise
  await db.runAsync('DELETE FROM progress WHERE id = ?', [id])
}

// =================== CONSULTAS ADICIONALES ===================

export const getWorkoutsByDay = async (day: string): Promise<Workout[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Workout>(
    'SELECT * FROM workouts WHERE day = ? ORDER BY name ASC',
    day
  )
}

export const getExerciseWorkouts = async (
  exerciseId: number
): Promise<Workout[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Workout>(
    `SELECT DISTINCT w.*
     FROM workouts w
     JOIN workout_exercises we ON w.id = we.workout_id
     WHERE we.exercise_id = ?
     ORDER BY w.name ASC`,
    exerciseId
  )
}

export const getRecentProgress = async (
  limit: number = 10
): Promise<(ProgressData & { exercise_name: string })[]> => {
  const db = await dbPromise
  return await db.getAllAsync<ProgressData & { exercise_name: string }>(
    `SELECT p.*, e.name as exercise_name
     FROM progress p
     JOIN exercises e ON p.exercise_id = e.id
     ORDER BY p.date DESC
     LIMIT ?`,
    limit
  )
}
