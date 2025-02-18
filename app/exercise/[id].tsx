import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect
} from 'react'
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native'
import {
  Chip,
  Text as PaperText,
  SegmentedButtons,
  useTheme,
  ActivityIndicator,
  Surface
} from 'react-native-paper'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import {
  getExercise,
  logMissingTranslation,
  searchExercises
} from '@/services/exerciseAPI'
import { useQuery } from '@tanstack/react-query'
import { SetRow } from '@/components/SetRow'
import {
  getSimilarExercises,
  translateExerciseName
} from '@/utils/exerciseTranslations'

interface SkeletonProps {
  width: number
  height: number
  borderRadius?: number
  style?: any
}
// Custom Skeleton component using Surface and ActivityIndicator
const Skeleton = ({
  width,
  height,
  borderRadius = 4,
  style = {}
}: SkeletonProps) => {
  const { colors } = useTheme()
  return (
    <Surface
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surfaceVariant,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        },
        style
      ]}
    >
      <ActivityIndicator animating={true} size="small" />
    </Surface>
  )
}

export default function ExerciseDetail() {
  const { colors } = useTheme()
  const { exercise } = useLocalSearchParams()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: colors.onBackground,
      // headerTitleStyle: {
      //   fontWeight: 'bold'
      // },
      title: 'Exercise Details',
      headerShadowVisible: false
    })
  }, [navigation, colors])

  const exerciseData =
    typeof exercise === 'string' ? JSON.parse(exercise) : exercise
  const setsCount = parseInt(exerciseData.sets, 10) || 0

  // Modificar la parte de useQuery para incluir traducción:
  const {
    data: exerciseList,
    isLoading: isLoadingList,
    error: listError
  } = useQuery({
    queryKey: ['exerciseSearch', exerciseData?.name],
    queryFn: async () => {
      // Log missing translation if not found
      if (
        !translateExerciseName(exerciseData.name).includes(
          exerciseData.name.toLowerCase()
        )
      ) {
        logMissingTranslation(exerciseData.name)
      }
      return await searchExercises(exerciseData.name)
    },
    enabled: !!exerciseData?.name
  })

  // Añadir un componente para sugerencias de traducción (dentro del componente ExerciseDetail)
  const TranslationSuggestions = ({
    exerciseName
  }: {
    exerciseName: string
  }) => {
    const similarExercises = getSimilarExercises(exerciseName)

    if (similarExercises.length === 0) return null

    return (
      <View style={{ marginTop: 20 }}>
        <PaperText variant="bodyMedium" style={{ marginBottom: 10 }}>
          La API de ejercicios solo funciona con nombres en inglés. Posibles
          traducciones:
        </PaperText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {similarExercises.map((suggestion, index) => (
            <Chip key={index} style={{ margin: 4 }} icon="translate">
              {suggestion}
            </Chip>
          ))}
        </View>
      </View>
    )
  }

  const findBestMatch = useCallback((results, searchTerm) => {
    if (!results || !results.length) return null

    const searchTermLower = searchTerm.toLowerCase()

    // 1. Try for exact match
    const exactMatch = results.find(
      ex => ex.name.toLowerCase() === searchTermLower
    )
    if (exactMatch) return exactMatch

    // 2. Try for partial match that contains the full search term
    const partialMatch = results.find(ex =>
      ex.name.toLowerCase().includes(searchTermLower)
    )
    if (partialMatch) return partialMatch

    // 3. Default to first result
    return results[0]
  }, [])

  // Get the best match exercise
  const bestMatch = useMemo(() => {
    if (exerciseList?.data && exerciseList.data.length > 0) {
      return findBestMatch(exerciseList.data, exerciseData.name)
    }
    return null
  }, [exerciseList, exerciseData.name, findBestMatch])

  // Fetch complete details for the best match
  const {
    data: completeExerciseDetails,
    isLoading: isLoadingDetails,
    error: detailsError
  } = useQuery({
    queryKey: ['exerciseDetails', bestMatch?.id],
    queryFn: async () => {
      if (!bestMatch?.id) throw new Error('No exercise ID available')
      return await getExercise(bestMatch.id)
    },
    enabled: !!bestMatch?.id
  })

  // Error handling for API calls
  const apiError = listError || detailsError
  const errorMessage = apiError?.message || null

  // Merged exercise details - local data first, then add API data when available
  const exerciseDetails = useMemo(() => {
    // Start with local data
    const mergedDetails = {
      ...exerciseData
    }

    // Add API data when available
    if (completeExerciseDetails?.data) {
      mergedDetails.gifUrl = completeExerciseDetails.data.gifUrl
      mergedDetails.instructions = completeExerciseDetails.data.instructions
      mergedDetails.secondaryMuscles =
        completeExerciseDetails.data.secondaryMuscles
      mergedDetails.bodyPart = completeExerciseDetails.data.bodyPart
    }

    return mergedDetails
  }, [exerciseData, completeExerciseDetails])

  if (!bestMatch && !isLoadingList && exerciseList?.data?.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <PaperText variant="titleLarge" style={styles.fontBold}>
          {exerciseData.name}
        </PaperText>
        <PaperText variant="bodyLarge" style={{ marginTop: 20 }}>
          No se encontraron datos para este ejercicio en la base de datos.
        </PaperText>
        <TranslationSuggestions exerciseName={exerciseData.name} />
        <PaperText variant="bodyMedium" style={{ marginTop: 20 }}>
          Puedes continuar usando este ejercicio en tu programa, pero sin
          información adicional como imágenes o instrucciones.
        </PaperText>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        {/* Image section with custom loading indicator */}
        {isLoadingDetails && !exerciseDetails.gifUrl ? (
          <Skeleton width={125} height={175} borderRadius={8} />
        ) : (
          <Image
            source={
              exerciseDetails.gifUrl
                ? { uri: exerciseDetails.gifUrl }
                : require('@/assets/images/epic.jpg')
            }
            style={styles.image}
          />
        )}

        <View style={styles.infoContainer}>
          <PaperText variant="titleLarge" style={styles.fontBold}>
            {exerciseDetails.name}
          </PaperText>
          <View style={styles.chipContainer}>
            <Chip icon="dumbbell" style={styles.chip}>
              {exerciseDetails.exercise_type || 'Unknown'}
            </Chip>
            <Chip icon="arm-flex" style={styles.chip}>
              {exerciseDetails.muscle_group || 'Unknown'}
            </Chip>
            {/* {exerciseDetails.bodyPart && (
              <Chip icon="human" style={styles.chip}>
                {exerciseDetails.bodyPart.charAt(0).toUpperCase() +
                  exerciseDetails.bodyPart.slice(1)}
              </Chip>
            )} */}
          </View>
          <View>
            <PaperText variant="bodyLarge" style={styles.fontBold}>
              About this exercise
            </PaperText>
            <PaperText
              variant="bodySmall"
              numberOfLines={3}
              style={[styles.fontRegular, { color: colors.onSurfaceVariant }]}
            >
              {exerciseDetails.notes || 'No description available'}
            </PaperText>
          </View>
        </View>
      </View>

      {/* Sets section */}
      <View style={styles.setsContainer}>
        <PaperText variant="titleMedium" style={{ marginBottom: 10 }}>
          Sets
        </PaperText>
        <FlatList
          data={Array.from({ length: setsCount }, (_, i) => i + 1)}
          keyExtractor={item => item.toString()}
          renderItem={({ item }) => <SetRow setNumber={item} />}
        />
      </View>

      {/* Instructions section with custom loading */}
      <View style={{ padding: 20 }}>
        <PaperText variant="titleMedium" style={styles.fontBold}>
          Instructions
        </PaperText>

        {isLoadingDetails ? (
          <View style={{ marginTop: 10 }}>
            {[1, 2, 3].map((_, index) => (
              <View
                key={index}
                style={{ flexDirection: 'row', marginVertical: 8 }}
              >
                <Skeleton width={15} height={20} style={{ marginRight: 5 }} />
                <Skeleton
                  width={Dimensions.get('window').width - 80}
                  height={20}
                />
              </View>
            ))}
          </View>
        ) : exerciseDetails.instructions &&
          exerciseDetails.instructions.length > 0 ? (
          <FlatList
            data={exerciseDetails.instructions}
            keyExtractor={(item, index) => `instruction-${index}`}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <PaperText style={{ marginRight: 5 }}>{index + 1}.</PaperText>
                <PaperText style={styles.fontRegular}>{item}</PaperText>
              </View>
            )}
          />
        ) : (
          <PaperText style={styles.fontRegular}>
            No instructions available
          </PaperText>
        )}
      </View>

      {/* Secondary muscles section - only show when data is available */}
      {exerciseDetails.secondaryMuscles &&
        exerciseDetails.secondaryMuscles.length > 0 && (
          <View style={{ padding: 20 }}>
            <PaperText variant="titleMedium" style={styles.fontBold}>
              Secondary Muscles
            </PaperText>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}
            >
              {exerciseDetails.secondaryMuscles.map((muscle, index) => (
                <Chip key={index} style={{ margin: 4 }} icon="muscle">
                  {muscle}
                </Chip>
              ))}
            </View>
          </View>
        )}

      {/* Show API error if present */}
      {apiError && (
        <View style={{ padding: 20, marginTop: 10 }}>
          <PaperText style={{ color: colors.error }}>
            Error loading additional details: {errorMessage}
          </PaperText>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fontBold: {
    fontFamily: 'ProductSans-Bold'
  },
  fontRegular: {
    fontFamily: 'ProductSans-Regular'
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    width: 125,
    height: 175,
    borderRadius: 8
  },
  infoContainer: {
    height: 175,
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  },
  chip: {
    borderRadius: 999
  },
  setsContainer: {
    paddingHorizontal: 20,
    marginTop: 10
  }
})
