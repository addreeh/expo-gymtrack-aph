import { Workout } from '@/types/types'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import {
  Card,
  Text as PaperText,
  IconButton,
  useTheme
} from 'react-native-paper'

interface WorkoutCardProps {
  workout: Workout
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const { colors } = useTheme()

  return (
    <Card
      style={{ backgroundColor: colors.elevation.level1 }}
      mode="contained"
      onPress={() =>
        router.push({
          pathname: '/workout/[id]',
          params: { id: workout.id }
        })
      }
    >
      <View className="relative">
        <Image
          source={require('@/assets/images/epic.jpg')}
          style={cardStyles.image}
        />
        <IconButton
          icon="play-circle"
          size={32}
          iconColor={colors.elevation.level1}
          style={cardStyles.playIcon}
          onPress={() => console.log('Play')}
        />
      </View>
      <View>
        <PaperText
          style={{ fontFamily: 'ProductSans-Bold' }}
          className="text-lg round w-"
        >
          {workout.name}
        </PaperText>
        <PaperText>{workout.day}</PaperText>
      </View>
    </Card>
  )
}

const cardStyles = StyleSheet.create({
  image: {
    width: 154,
    height: 154,
    borderRadius: 12,
    marginBottom: 8
  },
  playIcon: {
    position: 'absolute',
    bottom: '0%',
    right: '0%'
  }
})
