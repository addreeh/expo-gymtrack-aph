import React, { useState, useMemo } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Dimensions
} from 'react-native'
import {
  Text,
  Searchbar,
  Chip,
  useTheme,
  Portal,
  Modal,
  Button
} from 'react-native-paper'
import { exercises } from '@/constants/mockData'
import { Exercise } from '@/types/types'
import { FontAwesome6 } from '@expo/vector-icons'

const muscleGroups = [
  'All',
  ...new Set(exercises.map(exercise => exercise.muscle_group))
]
const exerciseTypes = [
  'All',
  ...new Set(exercises.map(exercise => exercise.exercise_type))
]

export default function ExerciseCatalogScreen() {
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  )

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesMuscle =
        selectedMuscleGroup === 'All' ||
        exercise.muscle_group === selectedMuscleGroup
      const matchesType =
        selectedType === 'All' || exercise.exercise_type === selectedType
      return matchesSearch && matchesMuscle && matchesType
    })
  }, [searchQuery, selectedMuscleGroup, selectedType])

  const renderExerciseCard = (exercise: Exercise) => (
    <Pressable
      style={[styles.exerciseCard, { backgroundColor: colors.surface }]}
      onPress={() => setSelectedExercise(exercise)}
    >
      <Image
        source={require('@/assets/images/epic.jpg')}
        style={styles.exerciseImage}
      />
      <View style={styles.exerciseInfo}>
        <Text variant="titleMedium" style={styles.exerciseName}>
          {exercise.name}
        </Text>
        <View style={styles.tagContainer}>
          <Chip icon="arm-flex" style={styles.tag}>
            {exercise.muscle_group}
          </Chip>
          <Chip icon="dumbbell" style={styles.tag}>
            {exercise.exercise_type}
          </Chip>
        </View>
      </View>
    </Pressable>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Exercise Catalog
        </Text>
        <Searchbar
          placeholder="Search exercises..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipGroup}>
            <Text variant="bodySmall" style={styles.chipGroupTitle}>
              Muscle Group
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {muscleGroups.map(group => (
                <Chip
                  key={group}
                  selected={selectedMuscleGroup === group}
                  onPress={() => setSelectedMuscleGroup(group)}
                  style={styles.filterChip}
                >
                  {group}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <View style={styles.chipGroup}>
            <Text variant="bodySmall" style={styles.chipGroupTitle}>
              Exercise Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
            >
              {exerciseTypes.map(type => (
                <Chip
                  key={type}
                  selected={selectedType === type}
                  onPress={() => setSelectedType(type)}
                  style={styles.filterChip}
                >
                  {type}
                </Chip>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.exerciseList}>
        <View style={styles.exerciseGrid}>
          {filteredExercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseWrapper}>
              {renderExerciseCard(exercise)}
            </View>
          ))}
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={selectedExercise !== null}
          onDismiss={() => setSelectedExercise(null)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.background }
          ]}
        >
          {selectedExercise && (
            <ScrollView>
              <Image
                source={require('@/assets/images/epic.jpg')}
                style={styles.modalImage}
              />
              <View style={styles.modalContent}>
                <Text variant="headlineSmall" style={styles.modalTitle}>
                  {selectedExercise.name}
                </Text>

                <View style={styles.modalTags}>
                  <Chip icon="arm-flex" style={styles.modalTag}>
                    {selectedExercise.muscle_group}
                  </Chip>
                  <Chip icon="dumbbell" style={styles.modalTag}>
                    {selectedExercise.exercise_type}
                  </Chip>
                </View>

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Instructions
                  </Text>
                  <Text style={styles.instructions}>
                    1. Start with proper form and positioning
                    {'\n'}2. Maintain control throughout the movement
                    {'\n'}3. Focus on muscle contraction
                    {'\n'}4. Breathe steadily during the exercise
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Tips
                  </Text>
                  <View style={styles.tipsList}>
                    {[
                      'Keep proper form',
                      'Control the movement',
                      'Stay focused'
                    ].map((tip, index) => (
                      <View key={index} style={styles.tip}>
                        <FontAwesome6
                          name="circle-check"
                          size={16}
                          color={colors.primary}
                        />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={() => setSelectedExercise(null)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </View>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  )
}

const { width } = Dimensions.get('window')
const cardWidth = (width - 48) / 2 // 48 = padding (16) * 2 + gap (16)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 16
  },
  title: {
    marginBottom: 16,
    fontFamily: 'ProductSans-Bold'
  },
  searchBar: {
    marginBottom: 16
  },
  filters: {
    paddingHorizontal: 16
  },
  chipGroup: {
    marginRight: 24
  },
  chipGroupTitle: {
    marginBottom: 8
  },
  chipScroll: {
    flexDirection: 'row'
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8
  },
  exerciseList: {
    flex: 1,
    padding: 16
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  exerciseWrapper: {
    width: cardWidth,
    marginBottom: 16
  },
  exerciseCard: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  exerciseImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover'
  },
  exerciseInfo: {
    padding: 12
  },
  exerciseName: {
    marginBottom: 8,
    fontFamily: 'ProductSans-Bold'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4
  },
  tag: {
    marginRight: 4
  },
  modal: {
    margin: 0,
    height: '100%'
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  modalContent: {
    padding: 16
  },
  modalTitle: {
    marginBottom: 16,
    fontFamily: 'ProductSans-Bold'
  },
  modalTags: {
    flexDirection: 'row',
    marginBottom: 24
  },
  modalTag: {
    marginRight: 8
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    marginBottom: 8,
    fontFamily: 'ProductSans-Bold'
  },
  instructions: {
    lineHeight: 24
  },
  tipsList: {
    gap: 8
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tipText: {
    flex: 1
  },
  closeButton: {
    marginTop: 16
  }
})
