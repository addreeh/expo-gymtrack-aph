import React from 'react'
import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import { Text as PaperText, useTheme } from 'react-native-paper'
import { workouts } from '@/constants/mockData'
import WorkoutCard from '@/components/WorkoutCard'
import { FontAwesome6 } from '@expo/vector-icons'
import WorkoutDrawer from '@/components/WorkoutDrawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
    const currentDay = days[new Date().getDay()]
    return currentDay
  }

  const getTodaysWorkout = () => {
    const currentDay = getCurrentDay()
    return workouts.find(workout => workout.day === currentDay)
  }

  const todaysWorkout = getTodaysWorkout()

  const renderWorkout = ({ item, index }) => (
    <View>
      <WorkoutCard title={item.name} subtitle={item.day} image={item.image} />
    </View>
  )

  return (
    <GestureHandlerRootView>
      <View
        className="flex-1"
        style={{ backgroundColor: colors.surfaceVariant }}
      >
        {/* Vista principal con el contenido */}
        <View
          className="px-5 pt-10 flex flex-col gap-8 flex-[0.88] rounded-b-[2.5rem]"
          style={{ backgroundColor: colors.background }}
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
              <FontAwesome6 name="arrow-right" size={18} color="white" />
            </View>
            <FlatList
              data={workouts}
              keyExtractor={item => item.id.toString()}
              renderItem={renderWorkout}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </View>
        {todaysWorkout && <WorkoutDrawer workout={todaysWorkout} />}
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
