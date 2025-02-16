import React, { useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Chip, Text as PaperText, useTheme } from 'react-native-paper'
import { workouts, progressData } from '@/constants/mockData'
import WorkoutCard from '@/components/WorkoutCard'
import { FontAwesome6 } from '@expo/vector-icons'
import WorkoutDrawer from '@/components/WorkoutDrawer'
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State
} from 'react-native-gesture-handler'
import { LineChart } from 'react-native-chart-kit'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

const screenWidth = Dimensions.get('window').width

export const ProgressSection = ({ progressByExercise }) => {
  const { colors } = useTheme()

  const [exerciseIndex, setExerciseIndex] = useState(0)
  // Valor compartido para la opacidad usando reanimated
  const chartOpacity = useSharedValue(1)

  // Datos del ejercicio seleccionado
  const selectedGroup = progressByExercise[exerciseIndex] || {
    progress: [],
    exerciseName: ''
  }
  const selectedProgressData = selectedGroup.progress

  // Configuración de los datos para el gráfico
  const chartData = {
    labels: selectedProgressData.map(item => item.date),
    datasets: [
      {
        data: selectedProgressData.map(item => item.weight)
      }
    ]
  }

  // Estilo animado para el contenedor del gráfico
  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: chartOpacity.value }
  })

  // Función de transición con animación usando withTiming de reanimated
  const animateChartTransition = newIndex => {
    chartOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setExerciseIndex)(newIndex)
      chartOpacity.value = withTiming(1, { duration: 200 })
    })
  }

  const handlePrev = () => {
    if (exerciseIndex > 0) {
      animateChartTransition(exerciseIndex - 1)
    }
  }

  const handleNext = () => {
    if (exerciseIndex < progressByExercise.length - 1) {
      animateChartTransition(exerciseIndex + 1)
    }
  }

  // Función para detectar el swipe
  const handleGesture = event => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent
      if (translationX < -50) {
        handleNext()
      } else if (translationX > 50) {
        handlePrev()
      }
    }
  }

  return (
    <View>
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-4">
          <PaperText
            style={{ fontFamily: 'ProductSans-Bold' }}
            className="text-white text-lg mt-[1px]"
          >
            Progress
          </PaperText>
          <PaperText style={styles.exerciseName}>
            <Chip>{selectedGroup.exerciseName}</Chip>
          </PaperText>
        </View>
        <View style={styles.progressButtons}>
          <TouchableOpacity onPress={handlePrev}>
            <FontAwesome6 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={{ marginLeft: 10 }}>
            <FontAwesome6 name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Envolvemos el gráfico en un PanGestureHandler para detectar swipes */}
      <PanGestureHandler onHandlerStateChange={handleGesture}>
        {/* Animated.View utiliza el valor de chartOpacity para la animación */}
        <Animated.View
          style={[styles.chartContainer, { opacity: chartOpacity }]}
        >
          {selectedProgressData.length > 0 ? (
            <LineChart
              data={chartData}
              width={screenWidth - 40} // Se resta el padding horizontal
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: colors.secondary,
                backgroundGradientTo: colors.secondary,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726'
                }
              }}
              bezier
              style={styles.chartStyle}
            />
          ) : (
            <PaperText style={styles.noDataText}>
              No progress data for this exercise
            </PaperText>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  exerciseName: {
    fontSize: 16,
    color: '#555',
    marginTop: 4
  },
  progressButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chartContainer: {
    marginVertical: 8
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  }
})
