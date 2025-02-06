import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Card, Text, IconButton, useTheme } from 'react-native-paper'

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
    <Card style={{ backgroundColor: colors.background }} mode="contained">
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
        <Text style={cardStyles.title}>{title}</Text>
        <Text>{subtitle}</Text>
      </View>
    </Card>
  )
}

const cardStyles = StyleSheet.create({
  image: {
    width: 164,
    height: 164,
    borderRadius: 8,
    marginBottom: 8
  },
  playIcon: {
    position: 'absolute',
    bottom: '0%',
    right: '0%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24
  }
})
