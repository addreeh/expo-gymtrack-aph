import React, { useState } from 'react'
import { View } from 'react-native'
import { Dropdown } from 'react-native-paper-dropdown'

const OPTIONS = [
  { label: 'Dumbbell', value: 'dumbbell' },
  { label: 'Barbell', value: 'barbell' },
  { label: 'Machine', value: 'machine' },
  { label: 'Bodyweight', value: 'bodyweight' },
  { label: 'Cable', value: 'cable' }
]

interface ExerciseTypeProps {
  exerciseType: string
  setExerciseType: (exerciseType: string) => void
}

export const ExerciseType = ({
  exerciseType,
  setExerciseType
}: ExerciseTypeProps) => {
  return (
    <View className="mb-4">
      <Dropdown
        label={exerciseType ? '' : 'Series Type'}
        placeholder="Exercise Material"
        mode="outlined"
        options={OPTIONS}
        value={exerciseType}
        onSelect={setExerciseType}
        hideMenuHeader
      />
    </View>
  )
}
