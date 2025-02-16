// app/exercise/[id].tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Animated
} from 'react-native'
import {
  Chip,
  Text as PaperText,
  SegmentedButtons,
  useTheme,
  TextInput,
  IconButton,
  Portal,
  Modal,
  Button
} from 'react-native-paper'
import Svg, { Path } from 'react-native-svg'
import { useLocalSearchParams } from 'expo-router'

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function ExerciseDetail() {
  const { colors } = useTheme()
  const { exercise } = useLocalSearchParams()
  // Si el ejercicio viene como string, lo parseamos
  const exerciseData =
    typeof exercise === 'string' ? JSON.parse(exercise) : exercise

  const [value, setValue] = useState('series')
  // Convertir el número de sets a number (por ejemplo, "4" -> 4)
  const setsCount = parseInt(exerciseData.sets, 10) || 0

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Sección superior: imagen e información */}
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/epic.jpg')}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <PaperText variant="titleLarge" style={styles.fontBold}>
            {exerciseData.name}
          </PaperText>
          <View style={styles.chipContainer}>
            <Chip
              icon="dumbbell"
              onPress={() => console.log('Pressed')}
              style={styles.chip}
            >
              {exerciseData.exercise_type}
            </Chip>
            <Chip
              icon="arm-flex"
              onPress={() => console.log('Pressed')}
              style={styles.chip}
            >
              {exerciseData.muscle_group}
            </Chip>
          </View>
          <View>
            <PaperText variant="bodyLarge" style={styles.fontBold}>
              About this exercise
            </PaperText>
            <PaperText
              variant="bodySmall"
              style={[styles.fontRegular, { color: colors.onSurfaceVariant }]}
            >
              {exerciseData.notes}
            </PaperText>
          </View>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            density="medium"
            style={{ paddingHorizontal: 30 }}
            buttons={[
              {
                value: 'series',
                label: `${exerciseData.sets} ${exerciseData.series_type}`,
                icon: 'dumbbell'
              }
            ]}
          />
        </View>
      </View>

      {/* Sección inferior: Lista de sets */}
      <View style={styles.setsContainer}>
        <PaperText variant="titleMedium" style={{ marginBottom: 10 }}>
          Sets
        </PaperText>
        <FlatList
          data={Array.from({ length: setsCount }, (_, i) => i + 1)}
          keyExtractor={item => item.toString()}
          renderItem={({ item }) => <SetRow setNumber={item} />}
        />
      </View>
    </SafeAreaView>
  )
}

interface SetRowProps {
  setNumber: number
}

const SetRow = ({ setNumber }: SetRowProps) => {
  const [checked, setChecked] = useState(false)
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const toggleCheckbox = () => {
    setChecked(!checked)
  }

  return (
    <>
      <View style={styles.setRow}>
        <AnimatedCheckbox checked={checked} onPress={toggleCheckbox} />
        <TextInput
          label="Reps"
          value={reps}
          onChangeText={setReps}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="Weight"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        <IconButton
          icon="dots-vertical"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <PaperText style={{ marginBottom: 20 }}>
            Options for Set {setNumber}
          </PaperText>
          <Button mode="contained" onPress={() => setModalVisible(false)}>
            Close
          </Button>
        </Modal>
      </Portal>
    </>
  )
}

/**
 * AnimatedCheckbox: Simula el efecto de "pintado" progresivo del check
 * usando react-native-svg para dibujar el check y Animated para animar
 * la propiedad strokeDashoffset.
 */
interface AnimatedCheckboxProps {
  checked: boolean
  onPress: () => void
}

const AnimatedCheckbox = ({ checked, onPress }: AnimatedCheckboxProps) => {
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
    outputRange: ['white', colors.primary] // ⚡ Cambiamos "transparent" por "white"
  })

  // Borde animado: outline cuando no está marcado, primary cuando está marcado
  const borderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.outline, colors.primary]
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
  fontBold: {
    fontFamily: 'ProductSans-Bold'
  },
  fontRegular: {
    fontFamily: 'ProductSans-Regular'
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10
  },
  image: {
    width: 125,
    height: 175,
    borderRadius: 8
  },
  infoContainer: {
    height: 175,
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  },
  chip: {
    borderRadius: 999
  },
  setsContainer: {
    paddingHorizontal: 20,
    marginTop: 10
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'white'
  },
  checkboxContainer: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center'
  }
})
