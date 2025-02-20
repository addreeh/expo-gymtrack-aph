import React from 'react'
import { View, StyleSheet, ScrollView, Image } from 'react-native'
import {
  Button,
  Chip,
  Text as PaperText,
  TextInput,
  Card,
  IconButton,
  List,
  Portal,
  Modal,
  useTheme
} from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams()
  const { colors } = useTheme()
  const [showAddExercise, setShowAddExercise] = React.useState(false)

  const workout = workouts.find(w => w.id === Number(id))
  const workoutExs = workoutExercises.filter(we => we.workout_id === Number(id))

  // Combinar ejercicios con sus detalles
  const exerciseDetails = workoutExs.map(we => {
    const exerciseDetail = exercises.find(e => e.id === we.exercise_id)
    return {
      ...we,
      ...exerciseDetail
    }
  })

  const exerciseMuscleGroups = workoutExs
    .map(we => {
      const exerciseDetail = exercises.find(e => e.id === we.exercise_id)
      return exerciseDetail?.muscle_group
    })
    .filter(Boolean)

  const uniqueMuscleGroups = [...new Set(exerciseMuscleGroups)]

  if (!workout) {
    return (
      <View>
        <PaperText>Workout not found</PaperText>
      </View>
    )
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background, padding: 16 }}>
      <View className="gap-4">
        {/* Header Section */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Image
            style={{ width: 125, height: 175, borderRadius: 8 }}
            source={require('@/assets/images/epic.jpg')}
          />
          <View style={{ flex: 1, gap: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {uniqueMuscleGroups.map((group, index) => (
                <Chip key={index} compact>
                  {group}
                </Chip>
              ))}
            </View>
            <View style={{ gap: 12 }}>
              <TextInput mode="outlined" label="Nombre" value={workout.name} />
              <TextInput
                mode="outlined"
                label="Descripción"
                value={workout.day}
              />
            </View>
          </View>
        </View>
        <Button mode="contained">Update Workout</Button>
      </View>
    </ScrollView>
  )
}
