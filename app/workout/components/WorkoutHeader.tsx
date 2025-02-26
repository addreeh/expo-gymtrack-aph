import React from 'react'
import { View, Image, Pressable } from 'react-native'
import { Chip, TextInput, IconButton } from 'react-native-paper'
import { useTheme } from 'react-native-paper'

const WorkoutHeader = ({ workout, uniqueMuscleGroups, handleImageClick }) => {
  const { colors } = useTheme()

  return (
    <View className="flex-row gap-4">
      <Pressable
        onPress={handleImageClick}
        className="relative rounded-lg overflow-hidden"
      >
        <Image
          className="w-32 h-44 rounded-lg"
          source={require('@/assets/images/epic.jpg')}
        />
        <View className="absolute bottom-0 right-0 bg-black/30 rounded-tl-lg">
          <IconButton icon="image-edit" size={24} iconColor={colors.surface} />
        </View>
      </Pressable>
      <View className="flex-1 gap-4">
        <View className="flex-row flex-wrap gap-2">
          {uniqueMuscleGroups.map((group, index) => (
            <Chip key={index} compact>
              {group}
            </Chip>
          ))}
        </View>
        <View className="gap-3">
          <TextInput mode="outlined" label="Nombre" value={workout.name} />
          <TextInput mode="outlined" label="Descripción" value={workout.day} />
        </View>
      </View>
    </View>
  )
}

export default WorkoutHeader
