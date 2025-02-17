import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text as PaperText, Checkbox } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'
import CustomCheckbox from './CustomCheckbox'
import { AnimatedCheckbox } from './AnimatedCheckbox'

const ExerciseItem = ({ exercise, colors, onToggleComplete }) => {
  const navigation = useNavigation()
  const [checked, setChecked] = useState(false)

  const toggleCheckbox = () => {
    setChecked(!checked)
  }

  const handlePress = () => {
    router.push({
      pathname: '/exercise/[id]',
      params: {
        id: exercise.id,
        exercise: JSON.stringify(exercise)
      }
    })
  }

  const handleCheckboxPress = e => {
    e.stopPropagation()
    onToggleComplete(exercise.id)
  }

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: colors.rippleColor }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.surfaceVariant : colors.surface,
          borderColor: colors.outline
        }
      ]}
    >
      <View
        style={[styles.exerciseCard, { backgroundColor: colors.background }]}
      >
        <Pressable
          onPress={handleCheckboxPress}
          style={styles.checkboxContainer}
        >
          <AnimatedCheckbox checked={checked} onPress={toggleCheckbox} />
        </Pressable>

        <View style={styles.contentContainer}>
          <View style={styles.mainInfo}>
            <PaperText
              variant="titleMedium"
              style={[
                styles.title,
                {
                  color: colors.onSurface,
                  textDecorationLine: exercise.completed
                    ? 'line-through'
                    : 'none'
                }
              ]}
            >
              {exercise.name}
            </PaperText>
            <View style={styles.statsContainer}>
              <View
                style={[
                  styles.stat,
                  { backgroundColor: colors.primaryContainer }
                ]}
              >
                <PaperText
                  variant="labelMedium"
                  style={[
                    styles.statText,
                    { color: colors.onPrimaryContainer }
                  ]}
                >
                  {exercise.sets} sets
                </PaperText>
              </View>
              <View
                style={[
                  styles.stat,
                  { backgroundColor: colors.primaryContainer }
                ]}
              >
                <PaperText
                  variant="labelMedium"
                  style={[
                    styles.statText,
                    { color: colors.onPrimaryContainer }
                  ]}
                >
                  {exercise.reps} reps
                </PaperText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden'
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8
  },
  checkboxContainer: {
    marginRight: 8
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mainInfo: {
    flex: 1
  },
  title: {
    fontFamily: 'ProductSans-Bold',
    marginBottom: 8
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  stat: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statText: {
    fontFamily: 'ProductSans-Regular'
  }
})

export default ExerciseItem
