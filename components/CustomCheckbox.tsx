import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated'
import { Svg, Path } from 'react-native-svg'
import { useTheme } from 'react-native-paper'

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const CustomCheckbox = ({
  checked,
  onPress,
  size = 28,
  borderRadius = 8,
  strokeWidth = 2
}) => {
  const { colors } = useTheme()

  const animatedCheckStyle = useAnimatedStyle(() => {
    const scale = withSpring(checked ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 200
    })

    const opacity = withTiming(checked ? 1 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    })

    return {
      transform: [{ scale }],
      opacity
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      checked ? colors.primary : 'transparent',
      { duration: 150 }
    )

    const borderColor = checked ? colors.primary : colors.outline

    return {
      backgroundColor,
      borderColor
    }
  })

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.hitSlop, pressed && styles.pressed]}
    >
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          {
            width: size,
            height: size,
            borderRadius: borderRadius,
            borderWidth: strokeWidth
          }
        ]}
      >
        <AnimatedSvg
          viewBox="0 0 24 24"
          style={[
            {
              width: size * 0.8,
              height: size * 0.8
            },
            animatedCheckStyle
          ]}
        >
          <AnimatedPath
            d="M4.5 12.5L9.5 17.5L19.5 7.5"
            stroke={colors.onPrimary}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </AnimatedSvg>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  hitSlop: {
    padding: 8
  },
  pressed: {
    opacity: 0.7
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CustomCheckbox
