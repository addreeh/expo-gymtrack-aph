import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text as PaperText, Chip } from 'react-native-paper'
import { useTheme } from 'react-native-paper'

const ExerciseList = ({ exerciseDetails, handleSelectExercise }) => {
  const { colors } = useTheme()

  return (
    <View className="flex flex-col gap-4">
      {exerciseDetails.map((exercise, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelectExercise(exercise)}
          onLongPress={() => handleSelectExercise(exercise)}
        >
          <View
            className="flex flex-col p-4 rounded-lg"
            style={{ backgroundColor: colors.elevation.level1 }}
          >
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-col gap-1">
                <PaperText variant="titleMedium" className="font-bold">
                  {exercise.name}
                </PaperText>
                <View className="flex flex-row gap-2">
                  <View className="flex flex-row gap-2 items-center">
                    <PaperText className="font-regular">
                      {exercise.sets}
                    </PaperText>
                    <PaperText className="font-regular">
                      {exercise.series_type} Sets
                    </PaperText>
                  </View>
                </View>
              </View>
              <View className="flex flex-row gap-2">
                <Chip className="h-11 flex items-center justify-center">
                  {exercise.exercise_type}
                </Chip>
                <Chip className="h-11 flex items-center justify-center">
                  {exercise.muscle_group}
                </Chip>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default ExerciseList
