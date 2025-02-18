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
          we.notes ?? '',
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

// Operaciones CRUD para Workouts
export const getWorkouts = async (): Promise<Workout[]> => {
  const db = await dbPromise
  return await db.getAllAsync<Workout>('SELECT * FROM workouts ORDER BY id ASC')
}

export const getWorkout = async (id: number): Promise<Workout> => {
  const db = await dbPromise
  const workout = await db.getFirstAsync<Workout>(
    'SELECT * FROM workouts WHERE id = ?',
    id
  )
  if (!workout) {
    throw new Error(`Workout with id ${id} not found`)
  }
  return workout
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

// Obtener ejercicios de una rutina
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

// Obtener progreso de un ejercicio
export const getExerciseProgress = async (
  exerciseId: number
): Promise<ProgressData[]> => {
  const db = await dbPromise
  return await db.getAllAsync<ProgressData>(
    'SELECT * FROM progress WHERE exercise_id = ? ORDER BY date ASC',
    exerciseId
  )
}
