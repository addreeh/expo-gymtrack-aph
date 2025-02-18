// src/screens/TranslationAdmin.tsx
import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import {
  Text,
  Card,
  TextInput,
  Button,
  List,
  Divider
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface MissingTranslation {
  count: number
  timestamp: number
}

export default function TranslationAdmin() {
  const [missingTranslations, setMissingTranslations] = useState<
    Record<string, MissingTranslation>
  >({})
  const [spanishName, setSpanishName] = useState('')
  const [englishName, setEnglishName] = useState('')

  useEffect(() => {
    loadMissingTranslations()
  }, [])

  const loadMissingTranslations = async () => {
    try {
      const data = await AsyncStorage.getItem('missing_translations')
      if (data) {
        setMissingTranslations(JSON.parse(data))
      }
    } catch (error) {
      console.error('Error loading missing translations:', error)
    }
  }

  const handleClearMissing = async () => {
    try {
      await AsyncStorage.removeItem('missing_translations')
      setMissingTranslations({})
    } catch (error) {
      console.error('Error clearing missing translations:', error)
    }
  }

  const handleAddTranslation = async () => {
    if (!spanishName.trim() || !englishName.trim()) {
      alert('Ambos campos son requeridos')
      return
    }

    try {
      // 1. Get current translations
      const translationsFile = require('@/utils/exerciseTranslations')
      const currentTranslations = translationsFile.exerciseTranslations

      // 2. Create updated translations object
      const updatedTranslations = {
        ...currentTranslations,
        [spanishName.toLowerCase().trim()]: englishName.toLowerCase().trim()
      }

      // 3. Display the code to copy
      const codeToUpdate = `export const exerciseTranslations: Record<string, string> = ${JSON.stringify(updatedTranslations, null, 2)}`

      alert(
        'Copia este código y reemplaza el objeto exerciseTranslations en src/utils/exerciseTranslations.ts\n\n' +
          codeToUpdate
      )

      // 4. Clear inputs
      setSpanishName('')
      setEnglishName('')

      // 5. Remove from missing translations if exists
      if (missingTranslations[spanishName.toLowerCase().trim()]) {
        const { [spanishName.toLowerCase().trim()]: removed, ...rest } =
          missingTranslations
        setMissingTranslations(rest)
        await AsyncStorage.setItem('missing_translations', JSON.stringify(rest))
      }
    } catch (error) {
      console.error('Error handling translation:', error)
      alert('Hubo un error al agregar la traducción')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Añadir Nueva Traducción" />
        <Card.Content>
          <TextInput
            label="Nombre en Español"
            value={spanishName}
            onChangeText={setSpanishName}
            style={styles.input}
          />
          <TextInput
            label="Nombre en Inglés"
            value={englishName}
            onChangeText={setEnglishName}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddTranslation}
            style={styles.button}
          >
            Añadir Traducción
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Traducciones Faltantes"
          subtitle={`${Object.keys(missingTranslations).length} ejercicios sin traducir`}
          right={props => <Button onPress={handleClearMissing}>Limpiar</Button>}
        />
        <Card.Content>
          {Object.keys(missingTranslations).length > 0 ? (
            Object.entries(missingTranslations)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, { count, timestamp }]) => (
                <View key={name}>
                  <List.Item
                    title={name}
                    description={`Solicitado ${count} ${count === 1 ? 'vez' : 'veces'} - Último: ${new Date(timestamp).toLocaleDateString()}`}
                    left={props => <List.Icon {...props} icon="translate" />}
                    onPress={() => {
                      setSpanishName(name)
                      setEnglishName('')
                    }}
                  />
                  <Divider />
                </View>
              ))
          ) : (
            <Text>No hay traducciones faltantes registradas</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  card: {
    marginBottom: 16
  },
  input: {
    marginBottom: 12
  },
  button: {
    marginTop: 8
  }
})
