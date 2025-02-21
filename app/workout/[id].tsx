import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native'
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
  useTheme,
  FAB
} from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'
import { Exercise } from '@/types/types'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams()
  const { colors } = useTheme()
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  )
  const [exerciseData, setExerciseData] = useState({
    sets: '',
    series_type: '',
    exercise_type: '',
    muscle_group: ''
  })

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

  const handleAddExercise = () => {
    setShowAddExercise(true)
  }

  const handleSelectExercise = exercise => {
    setSelectedExercise(exercise)
    setExerciseData({
      sets: exercise.sets,
      series_type: exercise.series_type,
      exercise_type: exercise.exercise_type,
      muscle_group: exercise.muscle_group
    })
    setShowExerciseModal(true)
  }

  const handleSaveExercise = () => {
    // Save the exercise data
    setShowExerciseModal(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ padding: 16 }}>
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
                <TextInput
                  mode="outlined"
                  label="Nombre"
                  value={workout.name}
                />
                <TextInput
                  mode="outlined"
                  label="Descripción"
                  value={workout.day}
                />
              </View>
            </View>
          </View>
          <Button mode="contained">Update Workout</Button>
          {/* Exercises Section */}
          <View className="flex flex-col gap-4">
            {exerciseDetails.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectExercise(exercise)}
                onLongPress={() => handleSelectExercise(exercise)}
              >
                <View
                  className="flex flex-col"
                  style={{
                    backgroundColor: colors.elevation.level1,
                    padding: 16,
                    borderRadius: 8
                  }}
                >
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-col gap-1">
                      <PaperText
                        variant="titleMedium"
                        style={{ fontFamily: 'ProductSans-Bold' }}
                      >
                        {exercise.name}
                      </PaperText>
                      <View className="flex flex-row gap-2">
                        <View className="flex flex-row gap-2 items-center">
                          <PaperText
                            style={{ fontFamily: 'ProductSans-Regular' }}
                          >
                            {exercise.sets}
                          </PaperText>
                          <PaperText
                            style={{ fontFamily: 'ProductSans-Regular' }}
                          >
                            {exercise.series_type} Sets
                          </PaperText>
                        </View>
                      </View>
                    </View>
                    <View className="flex flex-row gap-2">
                      <Chip
                        style={{
                          height: 45,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {exercise.exercise_type}
                      </Chip>
                      <Chip
                        style={{
                          height: 45,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {exercise.muscle_group}
                      </Chip>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={handleAddExercise} />
      <Portal>
        <Modal
          style={{
            flex: 1,
            margin: 30
          }}
          visible={showAddExercise}
          onDismiss={() => setShowAddExercise(false)}
        >
          <View
            style={{
              backgroundColor: colors.background,
              padding: 10,
              borderRadius: 16
            }}
          >
            <PaperText
              variant="titleLarge"
              style={{
                padding: 10,
                fontFamily: 'ProductSans-Bold'
              }}
            >
              Select Exercise
            </PaperText>
            <FlatList
              data={exercises}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  onPress={() => handleSelectExercise(item)}
                />
              )}
            />
          </View>
        </Modal>
        <Modal
          style={{
            flex: 1,
            margin: 30
          }}
          visible={showExerciseModal}
          onDismiss={() => setShowExerciseModal(false)}
        >
          <View
            style={{
              backgroundColor: colors.background,
              padding: 10,
              borderRadius: 16
            }}
          >
            <PaperText
              variant="titleLarge"
              style={{
                padding: 10,
                fontFamily: 'ProductSans-Bold'
              }}
            >
              Edit {selectedExercise?.name ?? 'Exercise'}
            </PaperText>
            <View style={{ padding: 8, gap: 10 }}>
              <TextInput
                mode="flat"
                label="Sets"
                value={exerciseData.sets}
                onChangeText={text =>
                  setExerciseData({ ...exerciseData, sets: text })
                }
              />
              <TextInput
                mode="flat"
                label="Series Type"
                value={exerciseData.series_type}
                onChangeText={text =>
                  setExerciseData({ ...exerciseData, series_type: text })
                }
              />
              <TextInput
                mode="flat"
                label="Exercise Type"
                value={exerciseData.exercise_type}
                onChangeText={text =>
                  setExerciseData({ ...exerciseData, exercise_type: text })
                }
              />
              <TextInput
                mode="flat"
                label="Muscle Group"
                value={exerciseData.muscle_group}
                onChangeText={text =>
                  setExerciseData({ ...exerciseData, muscle_group: text })
                }
              />
            </View>
            <Button
              mode="contained"
              style={{ margin: 10 }}
              onPress={handleSaveExercise}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
})
