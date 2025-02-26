import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { Button, Text as PaperText, FAB, useTheme } from 'react-native-paper'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'
import { Exercise } from '@/types/types'
import { getUserPreferences } from '@/services/animeAPI'
import { fetchGoogleDriveImages } from '@/services/googleDriveService'
import { useQuery } from '@tanstack/react-query'
import { animes } from '@/constants/animes'
import WorkoutHeader from './components/WorkoutHeader'
import ExerciseList from './components/ExerciseList'
import ImageGallery from './components/ImageGallery'
import {
  AddExerciseModal,
  EditExerciseModal,
  ImageSelectionModal
} from './components/Modals'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  )
  const [showImageModal, setShowImageModal] = useState(false)
  const [exerciseData, setExerciseData] = useState({
    sets: '',
    series_type: '',
    exercise_type: '',
    muscle_group: ''
  })

  // Query for user preferences with proper error handling
  const {
    data: preferences,
    isLoading: preferencesLoading,
    error: preferencesError
  } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const prefs = await getUserPreferences()
      console.log('Fetched preferences:', prefs)
      return prefs
    }
  })

  // Get the selected anime data
  const selectedAnime = preferences?.selectedAnime
    ? animes.find(a => a.id === preferences.selectedAnime)
    : null

  // Query for anime images with proper error handling
  const {
    data: animeImages,
    isLoading: imagesLoading,
    error: imagesError,
    refetch: refetchImages
  } = useQuery({
    queryKey: ['animeImages', selectedAnime?.id],
    queryFn: async () => {
      if (!selectedAnime?.images?.length) {
        console.log('No image folders found for anime:', selectedAnime?.id)
        return []
      }
      console.log('Fetching images for folders:', selectedAnime.images)
      const images = await fetchGoogleDriveImages(selectedAnime.images)
      console.log('Fetched images:', images)
      return images
    },
    enabled: !!selectedAnime?.images?.length
  })

  // Debug logging
  useEffect(() => {
    console.log('Preferences state:', {
      loading: preferencesLoading,
      error: preferencesError,
      data: preferences
    })
    console.log('Selected anime:', selectedAnime)
    console.log('Images state:', {
      loading: imagesLoading,
      error: imagesError,
      data: animeImages,
      folders: selectedAnime?.images
    })
  }, [
    preferences,
    selectedAnime,
    animeImages,
    preferencesLoading,
    preferencesError,
    imagesLoading,
    imagesError
  ])

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
    setShowExerciseModal(false)
  }

  const handleImageClick = () => {
    console.log('Image clicked', {
      hasImages: animeImages?.length > 0,
      imageCount: animeImages?.length,
      modalState: showImageModal
    })
    setShowImageModal(true)
  }

  const handleImageSelect = (imageUrl: string) => {
    console.log('Selected image:', imageUrl)
    // TODO: Implement image update logic
    setShowImageModal(false)
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="p-4">
        <View className="gap-4">
          <WorkoutHeader
            workout={workout}
            uniqueMuscleGroups={uniqueMuscleGroups}
            handleImageClick={handleImageClick}
          />
          <Button mode="contained">Update Workout</Button>
          <ExerciseList
            exerciseDetails={exerciseDetails}
            handleSelectExercise={handleSelectExercise}
          />
        </View>
      </ScrollView>

      <ImageSelectionModal
        visible={showImageModal}
        onDismiss={() => setShowImageModal(false)}
        preferencesLoading={preferencesLoading}
        imagesLoading={imagesLoading}
        preferencesError={preferencesError}
        imagesError={imagesError}
        refetchImages={refetchImages}
        selectedAnime={selectedAnime}
        animeImages={animeImages}
        handleImageSelect={handleImageSelect}
      />

      <AddExerciseModal
        visible={showAddExercise}
        onDismiss={() => setShowAddExercise(false)}
        exercises={exercises}
        handleSelectExercise={handleSelectExercise}
      />

      <EditExerciseModal
        visible={showExerciseModal}
        onDismiss={() => setShowExerciseModal(false)}
        selectedExercise={selectedExercise}
        exerciseData={exerciseData}
        setExerciseData={setExerciseData}
        handleSaveExercise={handleSaveExercise}
      />

      <FAB
        className="absolute m-4 right-0 bottom-0"
        icon="plus"
        onPress={handleAddExercise}
      />
    </View>
  )
}
