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
  Modal,
  IconButton
} from 'react-native-paper'
import { router } from 'expo-router'
import { Exercise } from '@/types/types'
import { exercises } from '@/constants/mockData'
import DraggableExerciseList from '@/components/DraggableExerciseList'

export default function CreateWorkoutScreen() {
  const { colors } = useTheme()

  const [formData, setFormData] = useState({
    name: '',
    day: '',
    description: '',
    difficulty: 'intermediate'
  })

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  const handleSave = (asDraft = false) => {
    setIsDraft(asDraft)
    // Here you would typically save to your backend
    console.log('Saving workout:', {
      ...formData,
      exercises: selectedExercises,
      isDraft
    })
    router.back()
  }

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => [...prev, exercise])
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Create New Workout
          </Text>

          <View style={styles.previewCard}>
            <Text variant="titleMedium" style={styles.previewTitle}>
              Preview
            </Text>
            <View style={styles.previewContent}>
              <Text variant="headlineSmall">{formData.name || 'Untitled'}</Text>
              <Text variant="bodyLarge">
                {formData.day || 'No day selected'}
              </Text>
              <Text variant="bodyMedium" style={styles.previewDescription}>
                {formData.description || 'No description'}
              </Text>
              <View style={styles.previewExercises}>
                <Text variant="bodySmall">
                  {selectedExercises.length} exercises selected
                </Text>
              </View>
            </View>
          </View>

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

          <DraggableExerciseList
            exercises={selectedExercises}
            onReorder={setSelectedExercises}
          />

          <Button
            mode="contained"
            onPress={() => setShowExerciseModal(true)}
            style={styles.addButton}
            icon="plus"
          >
            Add Exercise
          </Button>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => handleSave(true)}
          style={styles.footerButton}
        >
          Save as Draft
        </Button>
        <Button
          mode="contained"
          onPress={() => handleSave(false)}
          style={styles.footerButton}
        >
          Publish
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showExerciseModal}
          onDismiss={() => setShowExerciseModal(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.background }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Add Exercise
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowExerciseModal(false)}
            />
          </View>

          <ScrollView style={styles.exerciseList}>
            {exercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseInfo}>
                  <Text variant="titleMedium">{exercise.name}</Text>
                  <Text variant="bodyMedium">{exercise.muscle_group}</Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleAddExercise(exercise)
                    setShowExerciseModal(false)
                  }}
                >
                  Add
                </Button>
              </View>
            ))}
          </ScrollView>
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
  previewCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24
  },
  previewTitle: {
    marginBottom: 8,
    fontFamily: 'ProductSans-Bold'
  },
  previewContent: {
    gap: 4
  },
  previewDescription: {
    marginTop: 8,
    fontStyle: 'italic'
  },
  previewExercises: {
    marginTop: 8
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
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontFamily: 'ProductSans-Bold'
  },
  exerciseList: {
    padding: 16
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  exerciseInfo: {
    flex: 1
  }
})
