import React, { useCallback, useRef, useMemo } from 'react'
import { StyleSheet, View, Image, Dimensions } from 'react-native'
import { Text as PaperText, useTheme } from 'react-native-paper'
import { FontAwesome6 } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

const WorkoutDrawer = ({ workout }) => {
  const { colors } = useTheme()
  const { height } = Dimensions.get('window')

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null)

  // Variables para controlar la altura del BottomSheet
  const snapPoints = useMemo(() => ['12%', '50%'], [])
  const initialSnapPoint = 0 // Índice del primer snap point (12%)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={initialSnapPoint}
      onChange={handleSheetChanges}
      style={styles.container}
      handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
      backgroundStyle={{ backgroundColor: colors.surfaceVariant }}
      enablePanDownToClose={false}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { backgroundColor: colors.surfaceVariant, display: 'flex', gap: 10 }
        ]}
      >
        <View className="flex flex-row items-center justify-between w-full px-5">
          <View className="flex flex-row gap-5 items-center">
            <Image
              source={require('@/assets/images/bakugo.jpg')}
              style={{ width: 50, height: 50, borderRadius: 8 }}
            />
            <View className="flex flex-col">
              <PaperText
                variant="bodyLarge"
                style={{ fontFamily: 'ProductSans-Bold', color: 'white' }}
              >
                {workout.name}
              </PaperText>
              <PaperText
                variant="bodyMedium"
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: 'gray'
                }}
              >
                {workout.day}
              </PaperText>
              <PaperText
                variant="bodySmall"
                style={{
                  fontFamily: 'ProductSans-Regular',
                  color: 'gray'
                }}
              >
                9 exercises
              </PaperText>
            </View>
          </View>
          <View className="mr-5">
            <FontAwesome6 name="play" size={20} color={colors.onSurface} />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
})

export default WorkoutDrawer
