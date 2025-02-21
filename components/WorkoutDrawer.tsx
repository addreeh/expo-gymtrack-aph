import React, { useCallback, useRef, useMemo, useState } from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native'
import { Text as PaperText, useTheme } from 'react-native-paper'
import { FontAwesome6 } from '@expo/vector-icons'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView
} from '@gorhom/bottom-sheet'
import { exercises, workoutExercises } from '@/constants/mockData'
import ExerciseItem from './ExerciseItem'
import { Workout } from '@/types/types'

interface WorkoutDrawerProps {
  workout: Workout
}

const WorkoutDrawer = ({ workout }: WorkoutDrawerProps) => {
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Verificar si workout existe
  if (!workout) {
    return null // O puedes mostrar un componente de carga/error
  }

  // Alturas del BottomSheet
  const snapPoints = useMemo(() => ['12%', '50%'], [])
  const initialSnapPoint = 0

  // Filtrar ejercicios del workout
  const workoutExerciseList = useMemo(() => {
    return workoutExercises
      .filter(we => we.workout_id === workout.id)
      .map(we => ({
        ...we,
        ...exercises.find(ex => ex.id === we.exercise_id)
      }))
  }, [workout])

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const [completedExercises, setCompletedExercises] = useState(new Set())

  const handleToggleComplete = (exerciseId: number) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId)
      } else {
        newSet.add(exerciseId)
      }
      return newSet
    })
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={initialSnapPoint}
      onChange={handleSheetChanges}
      style={styles.container}
      handleIndicatorStyle={{ backgroundColor: colors.onBackground }}
      backgroundStyle={{ backgroundColor: colors.background }}
      enablePanDownToClose={false}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { backgroundColor: colors.background, display: 'flex', gap: 10 }
        ]}
      >
        <View
          className="flex flex-row items-center justify-between w-full"
          style={{ paddingInline: 20 }}
        >
          <View className="flex flex-row gap-5 items-center">
            <Image
              source={require('@/assets/images/bakugo.jpg')}
              style={{ width: 50, height: 50, borderRadius: 8 }}
            />
            <View className="flex flex-col" style={{ marginLeft: 10 }}>
              <PaperText
                variant="bodyLarge"
                style={{ fontFamily: 'ProductSans-Bold', color: 'white' }}
              >
                {workout.name}
              </PaperText>
              <PaperText
                variant="bodyMedium"
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: 'gray'
                }}
              >
                {workout.day}
              </PaperText>
              <PaperText
                variant="bodySmall"
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: 'gray'
                }}
              >
                9 exercises
              </PaperText>
            </View>
          </View>
          <View className="mr-5">
            <FontAwesome6 name="play" size={20} color={colors.onSurface} />
          </View>
        </View>
        <BottomSheetFlatList
          data={workoutExerciseList}
          keyExtractor={item => item.id.toString()}
          style={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <ExerciseItem
              exercise={{
                ...item,
                completed: completedExercises.has(item.id)
              }}
              colors={colors}
              onToggleComplete={handleToggleComplete}
            />
          )}
        />
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
})

export default WorkoutDrawer
