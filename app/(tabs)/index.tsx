import React from 'react'
import { StyleSheet, View, FlatList, Image } from 'react-native'
import { Text as PaperText, useTheme } from 'react-native-paper'
import {
  workouts,
  progressData,
  workoutExercises,
  exercises
} from '@/constants/mockData'
import WorkoutCard from '@/components/WorkoutCard'
import { FontAwesome6 } from '@expo/vector-icons'
import WorkoutDrawer from '@/components/WorkoutDrawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ProgressSection } from '@/components/ProgressSection'
import { router } from 'expo-router'

export default function TabOneScreen() {
  const { colors } = useTheme()

  const getCurrentDay = () => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    return days[new Date().getDay()]
  }

  const getTodaysWorkout = () => {
    const currentDay = getCurrentDay()
    return workouts.find(workout => workout.day === currentDay)
  }

  const todaysWorkout = getTodaysWorkout()

  // Si existe el workout de hoy, filtramos los ejercicios asociados y agrupamos su progreso.
  let progressByExercise = []
  if (todaysWorkout) {
    // Filtramos las relaciones de workoutExercises para el workout de hoy.
    const todaysWorkoutExercises = workoutExercises.filter(
      we => we.workout_id === todaysWorkout.id
    )
    // Por cada ejercicio del workout de hoy, buscamos su información en el array de exercises y agrupamos su progreso.
    progressByExercise = todaysWorkoutExercises.map(we => {
      const exerciseInfo = exercises.find(e => e.id === we.exercise_id)
      return {
        exerciseId: we.exercise_id,
        exerciseName: exerciseInfo ? exerciseInfo.name : 'Ejercicio',
        progress: progressData.filter(pd => pd.exercise_id === we.exercise_id)
      }
    })
  }

  const renderWorkout = ({ item, index }) => (
    <View>
      <WorkoutCard title={item.name} subtitle={item.day} image={item.image} />
    </View>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View
          className="p-5 flex flex-col gap-8 flex-1 rounded-b-[2.5rem]"
          style={{ backgroundColor: colors.elevation.level1 }}
        >
          <View className="flex flex-col gap-1">
            <PaperText
              variant="displaySmall"
              style={{ fontFamily: 'ProductSans-Bold' }}
              className="text-white"
            >
              Workouts
            </PaperText>
            <View className="flex flex-row gap-2 items-center">
              <PaperText
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: colors.onBackground
                }}
              >
                6 workouts
              </PaperText>
              <View
                style={{ backgroundColor: colors.primary }}
                className="h-1 w-1"
              />
              <PaperText
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: colors.onBackground
                }}
              >
                3 days
              </PaperText>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-4">
                <Image
                  source={require('@/assets/images/bakugo.jpg')}
                  className="w-7 h-7 rounded-md"
                />
                <View className="flex flex-row items-center gap-1">
                  <PaperText
                    style={{ fontFamily: 'ProductSans-Bold' }}
                    className="text-white text-lg mt-[1px]"
                  >
                    Adri
                  </PaperText>
                  <PaperText
                    style={{ fontFamily: 'ProductSans-Regular' }}
                    className="text-gray-200 text-lg"
                  >
                    created a folder
                  </PaperText>
                </View>
              </View>
              <FontAwesome6
                name="arrow-right"
                size={18}
                color="white"
                onPress={() => router.push('/workouts')}
              />
            </View>
            <FlatList
              data={workouts}
              keyExtractor={item => item.id.toString()}
              renderItem={renderWorkout}
              horizontal // Hace que la lista sea horizontal
              showsHorizontalScrollIndicator={false} // Oculta la barra de desplazamiento
              snapToAlignment="start"
              snapToInterval={200} // Ajusta el tamaño del scroll (modifícalo según el tamaño del item)
              decelerationRate="fast"
              // contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />} // Agrega espacio vertical entre elementos
            />
          </View>
          <ProgressSection progressByExercise={progressByExercise} />
        </View>
        {/* {todaysWorkout && <WorkoutDrawer workout={todaysWorkout} />} */}
        <WorkoutDrawer workout={todaysWorkout} />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    width: '100%'
  },
  listContainer: {
    paddingBottom: 16,
    backgroundColor: 'transparent'
  }
})
