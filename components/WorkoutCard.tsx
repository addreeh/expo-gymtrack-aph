import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import {
  Card,
  Text as PaperText,
  IconButton,
  useTheme
} from 'react-native-paper'

interface WorkoutCardProps {
  title: string
  subtitle: string
  image: string
}

export default function WorkoutCard({
  title,
  subtitle,
  image
}: WorkoutCardProps) {
  const { colors } = useTheme()

  return (
    <Card style={{ backgroundColor: colors.elevation.level1 }} mode="contained">
      <View className="relative">
        <Image
          source={require('@/assets/images/epic.jpg')}
          style={cardStyles.image}
        />
        <IconButton
          icon="play-circle"
          size={32}
          iconColor={colors.background}
          style={cardStyles.playIcon}
          onPress={() => console.log('Play')}
        />
      </View>
      <View>
        <PaperText
          style={{ fontFamily: 'ProductSans-Bold' }}
          className="text-lg round w-"
        >
          {title}
        </PaperText>
        <PaperText>{subtitle}</PaperText>
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
