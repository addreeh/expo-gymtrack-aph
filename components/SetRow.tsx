import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { AnimatedCheckbox } from './AnimatedCheckbox'
import {
  IconButton,
  Modal,
  Portal,
  TextInput,
  Text as PaperText,
  Button
} from 'react-native-paper'

interface SetRowProps {
  setNumber: number
}

export const SetRow = ({ setNumber }: SetRowProps) => {
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

const styles = StyleSheet.create({
  fontBold: {
    fontFamily: 'ProductSans-Bold'
  },
  fontRegular: {
    fontFamily: 'ProductSans-Regular'
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10
  },
  input: {
    flex: 1,
    marginHorizontal: 5
    // backgroundColor: 'white'
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center'
  }
})
