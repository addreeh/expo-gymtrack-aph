import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native'
import {
  Text as PaperText,
  FAB,
  Portal,
  Dialog,
  Button,
  useTheme,
  Menu
} from 'react-native-paper'
import { router, useNavigation } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'
import WorkoutListCard from '@/components/WorkoutListCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Tooltip from '@/components/Tooltip'

export default function WorkoutsScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [showTooltip, setShowTooltip] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: colors.onBackground,
      // headerTitleStyle: {
      //   fontWeight: 'bold'
      // },
      title: 'Current Workouts',
      headerShadowVisible: false
    })
  }, [navigation, colors])

  // Check if it's the first visit
  useEffect(() => {
    checkFirstVisit()
  }, [])

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedWorkouts')
      if (!hasVisited) {
        setShowTooltip(true)
        await AsyncStorage.setItem('hasVisitedWorkouts', 'true')
      }
    } catch (error) {
      console.error('Error checking first visit:', error)
    }
  }

  const handleLongPress = (workout, event) => {
    const { pageX, pageY } = event.nativeEvent
    setSelectedWorkout(workout)
    setMenuPosition({ x: pageX, y: pageY })
    setMenuVisible(true)
  }

  const handleEdit = () => {
    setMenuVisible(false)
    if (selectedWorkout) {
      router.push({
        pathname: '/workout/edit/[id]',
        params: { id: selectedWorkout.id }
      })
    }
  }

  const handleDelete = () => {
    setMenuVisible(false)
    setDeleteDialogVisible(true)
  }

  const confirmDelete = () => {
    // Implement delete logic here
    setDeleteDialogVisible(false)
    const message = 'Workout deleted successfully'
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT)
    } else {
      Alert.alert('Success', message)
    }
  }

  const getExercisePreview = workoutId => {
    const workoutExs = workoutExercises.filter(
      we => we.workout_id === workoutId
    )
    return workoutExs.map(we => {
      const exercise = exercises.find(e => e.id === we.exercise_id)
      return exercise ? exercise.name : ''
    })
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.workoutsList}>
          {workouts.map(workout => (
            <WorkoutListCard
              key={workout.id}
              workout={workout}
              exercises={getExercisePreview(workout.id)}
              onLongPress={event => handleLongPress(workout, event)}
              onPress={() =>
                router.push({
                  pathname: '/workout/[id]',
                  params: { id: workout.id }
                })
              }
            />
          ))}
        </View>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/workout/create')}
          label="Create Workout"
        />

        <Portal>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuPosition}
          >
            <Menu.Item onPress={handleEdit} title="Edit" leadingIcon="pencil" />
            <Menu.Item
              onPress={handleDelete}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>

          <Dialog
            visible={deleteDialogVisible}
            onDismiss={() => setDeleteDialogVisible(false)}
          >
            <Dialog.Title>Delete Workout</Dialog.Title>
            <Dialog.Content>
              <PaperText variant="bodyMedium">
                Are you sure you want to delete this workout? This action cannot
                be undone.
              </PaperText>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteDialogVisible(false)}>
                Cancel
              </Button>
              <Button onPress={confirmDelete}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {showTooltip && (
          <Tooltip
            text="Long press on a workout card to edit or delete"
            onClose={() => setShowTooltip(false)}
          />
        )}
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 16,
    paddingTop: 24
  },
  title: {
    fontFamily: 'ProductSans-Bold'
  },
  workoutsList: {
    padding: 16
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
})
