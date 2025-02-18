import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, StyleSheet, Image, SafeAreaView, FlatList } from 'react-native'
import {
  Chip,
  Text as PaperText,
  SegmentedButtons,
  useTheme
} from 'react-native-paper'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { getExercise, searchExercises } from '@/services/exerciseAPI'
import { useQuery } from '@tanstack/react-query'

export default function ExerciseDetail() {
  const { colors } = useTheme()
  const { exercise } = useLocalSearchParams()
  const navigation = useNavigation()

  const exerciseData =
    typeof exercise === 'string' ? JSON.parse(exercise) : exercise

  const {
    data: exerciseList,
    isLoading: isLoadingList,
    error: listError
  } = useQuery({
    queryKey: ['exerciseSearch', exerciseData?.name],
    queryFn: async () => {
      return await searchExercises(exerciseData.name)
    },
    enabled: !!exerciseData?.name
  })

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

  // Loading state
  if (isLoadingList || isLoadingDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <PaperText>Loading exercise details...</PaperText>
      </View>
    )
  }

  // Error handling
  if (listError || detailsError) {
    const errorMessage =
      (listError || detailsError)?.message || 'Error fetching exercise details'
    return (
      <View style={{ padding: 20 }}>
        <PaperText>Error: {errorMessage}</PaperText>
      </View>
    )
  }

  // No results case
  if (!bestMatch || !completeExerciseDetails?.data) {
    return (
      <View style={{ padding: 20 }}>
        <PaperText>
          No exercise details found for "{exerciseData.name}"
        </PaperText>
      </View>
    )
  }

  // Full exercise details to use in your UI
  const exerciseDetails = completeExerciseDetails.data

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Image
          source={
            exerciseDetails?.gifUrl
              ? { uri: exerciseDetails.gifUrl }
              : require('@/assets/images/epic.jpg')
          }
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <PaperText variant="titleLarge" style={styles.fontBold}>
            {exerciseDetails?.name || exerciseData.name}
          </PaperText>
          <View style={styles.chipContainer}>
            <Chip icon="dumbbell" style={styles.chip}>
              {exerciseDetails?.equipment ||
                exerciseData.exercise_type ||
                'Unknown'}
            </Chip>
            <Chip icon="arm-flex" style={styles.chip}>
              {exerciseDetails?.target ||
                exerciseData.muscle_group ||
                'Unknown'}
            </Chip>
            {exerciseDetails?.bodyPart && (
              <Chip icon="human" style={styles.chip}>
                {exerciseDetails.bodyPart}
              </Chip>
            )}
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
              {exerciseDetails?.instructions &&
              exerciseDetails.instructions.length > 0
                ? exerciseDetails.instructions[0]
                : exerciseData.notes || 'No description available'}
            </PaperText>
          </View>
        </View>
      </View>

      {/* Display instructions if available */}
      {exerciseDetails?.instructions &&
        exerciseDetails.instructions.length > 0 && (
          <View style={{ padding: 20 }}>
            <PaperText variant="titleMedium" style={styles.fontBold}>
              Instructions
            </PaperText>
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
          </View>
        )}

      {/* Secondary muscles section if available */}
      {exerciseDetails?.secondaryMuscles &&
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
  }
})
