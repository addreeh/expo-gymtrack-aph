import React, { useLayoutEffect, useState } from 'react'
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
  FAB,
  Surface
} from 'react-native-paper'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'
import { Exercise } from '@/types/types'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams()
  const { colors } = useTheme()
  const navigation = useNavigation()

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: colors.onBackground,
      headerTitleStyle: {
        fontFamily: 'ProductSans-Bold'
      },
      title: 'Workout Details',
      headerShadowVisible: false
    })
  }, [navigation, colors])

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
          visible={showAddExercise}
          onDismiss={() => setShowAddExercise(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.background }
          ]}
        >
          <View style={styles.modalHeader}>
            <PaperText variant="titleLarge" style={styles.modalTitle}>
              Add Exercise
            </PaperText>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowAddExercise(false)}
            />
          </View>
          <FlatList
            data={exercises}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Surface style={styles.exerciseListItem}>
                <View style={styles.exerciseListItemContent}>
                  <PaperText variant="titleMedium">{item.name}</PaperText>
                  <View style={styles.exerciseListItemTags}>
                    <Chip compact icon="arm-flex">
                      {item.muscle_group}
                    </Chip>
                    <Chip compact icon="dumbbell">
                      {item.exercise_type}
                    </Chip>
                  </View>
                </View>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleSelectExercise(item)
                    setShowAddExercise(false)
                  }}
                >
                  Add
                </Button>
              </Surface>
            )}
            contentContainerStyle={styles.exerciseListContainer}
          />
        </Modal>

        <Modal
          visible={showExerciseModal}
          onDismiss={() => setShowExerciseModal(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.background }
          ]}
        >
          <View style={styles.modalHeader}>
            <PaperText variant="titleLarge" style={styles.modalTitle}>
              Edit {selectedExercise?.name}
            </PaperText>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowExerciseModal(false)}
            />
          </View>
          <ScrollView style={styles.modalContent}>
            <TextInput
              mode="outlined"
              label="Sets"
              value={exerciseData.sets}
              onChangeText={text =>
                setExerciseData({ ...exerciseData, sets: text })
              }
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Series Type"
              value={exerciseData.series_type}
              onChangeText={text =>
                setExerciseData({ ...exerciseData, series_type: text })
              }
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Exercise Type"
              value={exerciseData.exercise_type}
              onChangeText={text =>
                setExerciseData({ ...exerciseData, exercise_type: text })
              }
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Muscle Group"
              value={exerciseData.muscle_group}
              onChangeText={text =>
                setExerciseData({ ...exerciseData, muscle_group: text })
              }
              style={styles.input}
            />
            <Button
              mode="contained"
              style={styles.saveButton}
              onPress={handleSaveExercise}
            >
              Save Changes
            </Button>
          </ScrollView>
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
  },
  container: {
    flex: 1
  },
  header: {
    height: 200,
    overflow: 'hidden'
  },
  headerGradient: {
    flex: 1
  },
  headerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between'
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  workoutName: {
    fontFamily: 'ProductSans-Bold'
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16
  },
  statItem: {
    alignItems: 'center',
    gap: 8
  },
  statText: {
    fontFamily: 'ProductSans-Regular'
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: -20
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressTitle: {
    fontFamily: 'ProductSans-Bold'
  },
  progressPercentage: {
    fontFamily: 'ProductSans-Bold'
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  },
  muscleGroupsContainer: {
    marginBottom: 16
  },
  muscleGroupChip: {
    marginRight: 8
  },
  sectionTitle: {
    fontFamily: 'ProductSans-Bold',
    marginBottom: 16
  },
  exerciseList: {
    gap: 12
  },
  exerciseCard: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  exerciseCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  exerciseInfo: {
    flex: 1,
    gap: 8
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  exerciseName: {
    fontFamily: 'ProductSans-Bold'
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  modal: {
    padding: 8,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingInline: 16,
    paddingTop: 4
  },
  modalTitle: {
    fontFamily: 'ProductSans-Bold'
  },
  modalContent: {
    padding: 16
  },
  input: {
    marginBottom: 16
  },
  saveButton: {
    marginTop: 8
  },
  exerciseListContainer: {
    padding: 16,
    gap: 12
  },
  exerciseListItem: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  exerciseListItemContent: {
    flex: 1,
    gap: 8
  },
  exerciseListItemTags: {
    flexDirection: 'row',
    gap: 8
  }
})
