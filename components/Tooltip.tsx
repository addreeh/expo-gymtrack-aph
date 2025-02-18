import React, { useEffect } from 'react'
import { StyleSheet, Animated } from 'react-native'
import { Surface, Text, IconButton } from 'react-native-paper'

export default function Tooltip({ text, onClose }) {
  const opacity = new Animated.Value(0)

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        delay: 3000,
        useNativeDriver: true
      })
    ]).start(() => onClose())
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Surface style={styles.surface}>
        <Text variant="bodyMedium">{text}</Text>
        <IconButton icon="close" size={20} onPress={onClose} />
      </Surface>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    alignItems: 'center'
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    elevation: 4
  }
})
