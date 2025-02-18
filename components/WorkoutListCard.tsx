import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Text as PaperText, useTheme, Card } from 'react-native-paper'
import { FontAwesome6 } from '@expo/vector-icons'

export default function WorkoutListCard({
  workout,
  exercises,
  onLongPress,
  onPress
}) {
  const { colors } = useTheme()

  return (
    <Pressable onLongPress={onLongPress} onPress={onPress}>
      <Card
        style={[styles.card, { backgroundColor: colors.elevation.level1 }]}
        mode="elevated"
      >
        <Card.Content>
          <View style={styles.header}>
            <View>
              <PaperText
                variant="titleLarge"
                style={[styles.title, { color: colors.onSurface }]}
              >
                {workout.name}
              </PaperText>
              <PaperText
                variant="bodySmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Created on {workout.day}
              </PaperText>
            </View>
            <FontAwesome6
              name="ellipsis-vertical"
              size={16}
              color={colors.onSurfaceVariant}
            />
          </View>

          <View style={styles.exercisePreview}>
            {exercises.slice(0, 3).map((exercise, index) => (
              <PaperText
                key={index}
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                • {exercise}
              </PaperText>
            ))}
            {exercises.length > 3 && (
              <PaperText
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                +{exercises.length - 3} more
              </PaperText>
            )}
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  title: {
    fontFamily: 'ProductSans-Bold'
  },
  exercisePreview: {
    marginTop: 8
  }
})
