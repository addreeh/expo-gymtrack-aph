import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, IconButton, useTheme } from 'react-native-paper'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import { Exercise } from '@/types/types'
import {
  GestureHandlerRootView,
  PanGestureHandler
} from 'react-native-gesture-handler'

interface DraggableExerciseListProps {
  exercises: Exercise[]
  onReorder: (newOrder: Exercise[]) => void
}

export default function DraggableExerciseList({
  exercises,
  onReorder
}: DraggableExerciseListProps) {
  const { colors } = useTheme()

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    const newExercises = [...exercises]
    const [removed] = newExercises.splice(fromIndex, 1)
    newExercises.splice(toIndex, 0, removed)
    onReorder(newExercises)
  }

  return (
    <View style={styles.container}>
      {exercises.map((exercise, index) => (
        <DraggableItem
          key={exercise.id}
          exercise={exercise}
          index={index}
          onDragEnd={handleDragEnd}
          colors={colors}
        />
      ))}
    </View>
  )
}

interface DraggableItemProps {
  exercise: Exercise
  index: number
  onDragEnd: (fromIndex: number, toIndex: number) => void
  colors: any
}

function DraggableItem({
  exercise,
  index,
  onDragEnd,
  colors
}: DraggableItemProps) {
  const translateY = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  return (
    <GestureHandlerRootView>
      <PanGestureHandler>
        <Animated.View
          style={[
            styles.item,
            animatedStyle,
            { backgroundColor: colors.surface }
          ]}
        >
          <IconButton icon="drag" size={24} />
          <View style={styles.exerciseInfo}>
            <Text variant="titleMedium">{exercise.name}</Text>
            <Text variant="bodySmall">{exercise.muscle_group}</Text>
          </View>
          <IconButton icon="close" size={24} />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  exerciseInfo: {
    flex: 1
  }
})
