import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Text as PaperText, useTheme } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams()
  const { colors } = useTheme()

  const workout = workouts.find(w => w.id === Number(id))
  const workoutExs = workoutExercises.filter(we => we.workout_id === Number(id))

  if (!workout) {
    return (
      <View style={styles.container}>
        <PaperText>Workout not found</PaperText>
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <PaperText variant="headlineMedium" style={styles.title}>
          {workout.name}
        </PaperText>
        <PaperText
          variant="bodyMedium"
          style={{ color: colors.onSurfaceVariant }}
        >
          {workout.day}
        </PaperText>
      </View>

      <View style={styles.exercises}>
        {workoutExs.map(workoutEx => {
          const exercise = exercises.find(e => e.id === workoutEx.exercise_id)
          return (
            <View key={workoutEx.id} style={styles.exerciseItem}>
              <PaperText variant="titleMedium" style={styles.exerciseName}>
                {exercise?.name}
              </PaperText>
              <View style={styles.exerciseDetails}>
                <PaperText>Sets: {workoutEx.sets}</PaperText>
                <PaperText>Reps: {workoutEx.reps}</PaperText>
                <PaperText>Rest: {workoutEx.rest}s</PaperText>
              </View>
              {workoutEx.notes && (
                <PaperText style={styles.notes}>{workoutEx.notes}</PaperText>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 16,
    paddingTop: 24
  },
  title: {
    fontFamily: 'ProductSans-Bold'
  },
  exercises: {
    padding: 16
  },
  exerciseItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  exerciseName: {
    marginBottom: 8,
    fontFamily: 'ProductSans-Bold'
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  notes: {
    fontStyle: 'italic',
    marginTop: 8
  }
})
