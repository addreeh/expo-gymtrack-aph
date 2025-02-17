import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Chip,
  Portal,
  Modal
} from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { workouts, exercises, workoutExercises } from '@/constants/mockData'
import { Workout, Exercise, WorkoutExercise } from '@/types/types'
import ExerciseItem from '@/components/ExerciseItem'

export default function EditWorkoutScreen() {
  const { colors } = useTheme()
  const { id } = useLocalSearchParams()

  // Find the workout and its exercises
  const workout = workouts.find(w => w.id.toString() === id)
  const workoutExercisesList = workoutExercises.filter(
    we => we.workout_id.toString() === id
  )

  const [formData, setFormData] = useState({
    name: workout?.name || '',
    day: workout?.day || '',
    description: workout?.description || '',
    difficulty: workout?.difficulty || 'intermediate'
  })

  const [selectedExercises, setSelectedExercises] = useState(
    workoutExercisesList.map(we => ({
      ...we,
      ...exercises.find(e => e.id === we.exercise_id)
    }))
  )

  const [showExerciseModal, setShowExerciseModal] = useState(false)

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving workout:', {
      ...formData,
      exercises: selectedExercises
    })
    router.back()
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Edit Workout
          </Text>

          <TextInput
            label="Workout Name"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Day"
            value={formData.day}
            onChangeText={text => setFormData({ ...formData, day: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={text =>
              setFormData({ ...formData, description: text })
            }
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <View style={styles.chipContainer}>
            <Chip
              selected={formData.difficulty === 'beginner'}
              onPress={() =>
                setFormData({ ...formData, difficulty: 'beginner' })
              }
              style={styles.chip}
            >
              Beginner
            </Chip>
            <Chip
              selected={formData.difficulty === 'intermediate'}
              onPress={() =>
                setFormData({ ...formData, difficulty: 'intermediate' })
              }
              style={styles.chip}
            >
              Intermediate
            </Chip>
            <Chip
              selected={formData.difficulty === 'advanced'}
              onPress={() =>
                setFormData({ ...formData, difficulty: 'advanced' })
              }
              style={styles.chip}
            >
              Advanced
            </Chip>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Exercises
          </Text>

          {selectedExercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              colors={colors}
              onToggleComplete={() => {}}
            />
          ))}

          <Button
            mode="contained"
            onPress={() => setShowExerciseModal(true)}
            style={styles.addButton}
          >
            Add Exercise
          </Button>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.footerButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.footerButton}
        >
          Save Changes
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showExerciseModal}
          onDismiss={() => setShowExerciseModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Add Exercise
          </Text>
          {/* Exercise selection content would go here */}
          <Button onPress={() => setShowExerciseModal(false)}>Close</Button>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 16
  },
  title: {
    marginBottom: 24,
    fontFamily: 'ProductSans-Bold'
  },
  input: {
    marginBottom: 16
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24
  },
  chip: {
    marginRight: 8
  },
  sectionTitle: {
    marginBottom: 16,
    fontFamily: 'ProductSans-Bold'
  },
  addButton: {
    marginTop: 16
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8
  },
  modalTitle: {
    marginBottom: 16
  }
})
