import ImageGallery from '@/components/ImageGallery'
import React from 'react'
import { View, ScrollView, FlatList } from 'react-native'
import {
  Modal,
  Portal,
  Text as PaperText,
  IconButton,
  TextInput,
  Button,
  Surface,
  Chip,
  ActivityIndicator
} from 'react-native-paper'
import { useTheme } from 'react-native-paper'
import { SeriesType } from '@/app/workout/components/SeriesType'
import { ExerciseType } from '@/app/workout/components/ExerciseType'

type Exercise = {
  id: number
  name: string
  muscle_group: string
  exercise_type: string
}

type ExerciseData = {
  sets: string
  series_type: string
  exercise_type: string
  muscle_group: string
}

type AddExerciseModalProps = {
  visible: boolean
  onDismiss: () => void
  exercises: Exercise[]
  handleSelectExercise: (exercise: Exercise) => void
}

type EditExerciseModalProps = {
  visible: boolean
  onDismiss: () => void
  selectedExercise: Exercise | null
  exerciseData: ExerciseData
  setExerciseData: (data: ExerciseData) => void
  handleSaveExercise: () => void
}

type ImageSelectionModalProps = {
  visible: boolean
  onDismiss: () => void
  preferencesLoading: boolean
  imagesLoading: boolean
  preferencesError?: Error
  imagesError?: Error
  refetchImages: () => void
  selectedAnime?: string
  animeImages?: string[]
  handleImageSelect: (image: string) => void
}

export const AddExerciseModal = ({
  visible,
  onDismiss,
  exercises,
  handleSelectExercise
}: AddExerciseModalProps) => {
  const { colors } = useTheme()

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          {
            backgroundColor: colors.background,
            padding: 20,
            margin: 20,
            borderRadius: 10,
            maxHeight: '80%'
          }
        ]}
      >
        <View className="flex-row justify-between items-center px-4 pt-1">
          <PaperText variant="titleLarge" className="font-bold">
            Add Exercise
          </PaperText>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>
        <FlatList
          data={exercises}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Surface className="p-4 rounded-lg flex-row items-center mb-3">
              <View className="flex-1 gap-2">
                <PaperText variant="titleMedium">{item.name}</PaperText>
                <View className="flex-row gap-2">
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
                  onDismiss()
                }}
              >
                Add
              </Button>
            </Surface>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </Modal>
    </Portal>
  )
}

export const EditExerciseModal = ({
  visible,
  onDismiss,
  selectedExercise,
  exerciseData,
  setExerciseData,
  handleSaveExercise
}: EditExerciseModalProps) => {
  const { colors } = useTheme()

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          {
            backgroundColor: colors.background,
            padding: 10,
            margin: 40,
            borderRadius: 10,
            maxHeight: '80%'
          }
        ]}
      >
        <View className="flex-row justify-between items-center px-4 pt-1">
          <PaperText variant="titleLarge" className="font-bold">
            {selectedExercise
              ? `Edit ${selectedExercise.name}`
              : 'Edit Exercise'}
          </PaperText>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>
        <ScrollView className="p-4 flex flex-col gap-10">
          <View className="flex flex-row gap-2 w-full justify-center items-center mb-4">
            <View className="flex-1">
              <TextInput
                mode="outlined"
                label="Sets"
                value={exerciseData.sets}
                onChangeText={text =>
                  setExerciseData({ ...exerciseData, sets: text })
                }
                className="w-full"
                style={{ width: '100%', height: 54 }}
              />
            </View>
            <View className="flex-1 mt-2">
              <SeriesType
                seriesType={exerciseData.series_type}
                setSeriesType={seriesType =>
                  setExerciseData({ ...exerciseData, series_type: seriesType })
                }
              />
            </View>
          </View>
          <ExerciseType
            exerciseType={exerciseData.exercise_type}
            setExerciseType={exerciseType =>
              setExerciseData({ ...exerciseData, exercise_type: exerciseType })
            }
          />
          <TextInput
            mode="outlined"
            label="Notes"
            multiline
            value={exerciseData.muscle_group}
            onChangeText={text =>
              setExerciseData({ ...exerciseData, muscle_group: text })
            }
          />
          <Button
            className="mt-4"
            mode="contained"
            onPress={handleSaveExercise}
          >
            Save Changes
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  )
}

export const ImageSelectionModal = ({
  visible,
  onDismiss,
  preferencesLoading,
  imagesLoading,
  preferencesError,
  imagesError,
  refetchImages,
  selectedAnime,
  animeImages,
  handleImageSelect
}: ImageSelectionModalProps) => {
  const { colors } = useTheme()

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          {
            backgroundColor: colors.background,
            padding: 10,
            margin: 40,
            borderRadius: 10,
            maxHeight: '80%'
          }
        ]}
      >
        <View className="flex-row justify-between items-center px-4 pt-1">
          <PaperText variant="titleLarge" className="font-bold">
            Select Image
          </PaperText>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>
        {preferencesLoading || imagesLoading ? (
          <View className="p-5 items-center">
            <ActivityIndicator size="large" />
            <PaperText className="mt-2">Loading images...</PaperText>
          </View>
        ) : preferencesError || imagesError ? (
          <View className="p-5 items-center">
            <PaperText className="mb-2 text-red-500">
              {preferencesError?.message ||
                imagesError?.message ||
                'Error loading images'}
            </PaperText>
            <Button onPress={() => refetchImages()}>Retry</Button>
          </View>
        ) : !selectedAnime ? (
          <View className="p-5 items-center">
            <PaperText>No anime selected in preferences</PaperText>
          </View>
        ) : (
          <View className="p-5 items-center">
            <PaperText>No images available</PaperText>
            <Button onPress={() => refetchImages()}>
              Retry Loading Images
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  )
}
