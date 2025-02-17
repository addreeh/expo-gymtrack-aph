import { useEffect, useRef } from 'react'
import { StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { useTheme } from 'react-native-paper'
import Svg, { Path } from 'react-native-svg'

interface AnimatedCheckboxProps {
  checked: boolean
  onPress: () => void
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

export const AnimatedCheckbox = ({
  checked,
  onPress
}: AnimatedCheckboxProps) => {
  const { colors } = useTheme()
  const animation = useRef(new Animated.Value(0)).current
  const totalLength = 24

  useEffect(() => {
    Animated.timing(animation, {
      toValue: checked ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start()
  }, [checked])

  // Fondo animado: blanco cuando no está marcado, primary cuando está marcado
  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.primary] // ⚡ Cambiamos "transparent" por "white"
  })

  // Borde animado: outline cuando no está marcado, primary cuando está marcado
  const borderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.onSurfaceDisabled, colors.background]
  })

  // Animación del check (progresiva de izquierda a derecha)
  const strokeDashoffset = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [totalLength, 0]
  })

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          styles.checkboxContainer,
          { borderColor, backgroundColor } // ⚡ Siempre tendrá un borde visible
        ]}
      >
        <Svg width="30" height="30" viewBox="0 0 30 30">
          <AnimatedPath
            d="M7 15 L13 21 L23 9"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray={totalLength}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    marginTop: 5,
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  }
})
