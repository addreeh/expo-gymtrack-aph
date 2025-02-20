import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect
} from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  FlatList,
  RefreshControl,
  Dimensions
} from 'react-native'
import {
  Text as PaperText,
  FAB,
  Portal,
  Dialog,
  Button,
  useTheme,
  Menu,
  Searchbar,
  Chip,
  Surface,
  IconButton
} from 'react-native-paper'
import { router, useNavigation } from 'expo-router'
import { workouts, workoutExercises, exercises } from '@/constants/mockData'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome6 } from '@expo/vector-icons'
import {
  GestureHandlerRootView,
  Swipeable,
  RectButton,
  ScrollView
} from 'react-native-gesture-handler'
import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

const { width } = Dimensions.get('window')
const COLUMN_GAP = 16
const NUM_COLUMNS = 2
const CARD_WIDTH = (width - 32 - COLUMN_GAP) / NUM_COLUMNS

const WorkoutCard = ({ workout, onPress, onLongPress, onDelete }) => {
  const { colors } = useTheme()
  const swipeableRef = useRef(null)

  const workoutExs = workoutExercises.filter(we => we.workout_id === workout.id)
  const totalExercises = workoutExs.length
  const completedExercises = Math.floor(Math.random() * totalExercises) // Simulado

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    return (
      <RectButton
        style={[styles.deleteAction, { backgroundColor: colors.error }]}
        onPress={() => {
          swipeableRef.current?.close()
          onDelete()
        }}
      >
        <Animated.View
          style={[styles.deleteActionContent, { transform: [{ scale }] }]}
        >
          <FontAwesome6 name="trash-can" size={24} color="white" />
        </Animated.View>
      </RectButton>
    )
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={{ marginBottom: 16 }}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.elevation.level2,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <Surface
          style={{
            backgroundColor: colors.elevation.level2,
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            borderRadius: 12,
            gap: 16
          }}
          elevation={0}
        >
          <View
            className="flex flex-col items-center rounded-xl w-28 h-28 p-1 justify-between"
            style={{ backgroundColor: colors.surface }}
          >
            <PaperText
              style={{
                borderRadius: 12,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: colors.elevation.level2,
                backgroundColor: colors.primary,
                padding: 1,
                textAlign: 'center',
                fontFamily: 'ProductSans-Bold'
              }}
            >
              MAY
            </PaperText>
            <PaperText
              variant="headlineLarge"
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: 'ProductSans-Bold',
                marginTop: 6
              }}
            >
              5
            </PaperText>
            <PaperText
              variant="titleMedium"
              style={{
                color: colors.onSurfaceVariant,
                fontFamily: 'ProductSans-Bold',
                marginBottom: 4
              }}
            >
              {workout.day}
            </PaperText>
          </View>
          <View className="flex flex-col gap-1">
            <PaperText
              variant="titleMedium"
              style={{
                fontFamily: 'ProductSans-Bold',
                color: colors.onBackground
              }}
            >
              {workout.name}
            </PaperText>
            <PaperText
              variant="titleSmall"
              style={{
                fontFamily: 'ProductSans-Regular',
                color: colors.onBackground
              }}
            >
              {totalExercises}
            </PaperText>
            <PaperText
              variant="titleSmall"
              style={{
                fontFamily: 'ProductSans-Regular',
                color: colors.onBackground
              }}
            >
              {/* {workout.notes} */}
              Ten cuidadito
            </PaperText>
          </View>
        </Surface>
      </Pressable>
    </Swipeable>
  )
}

const SORT_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Date', value: 'date' },
  { label: 'Progress', value: 'progress' }
]

const DIFFICULTY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function WorkoutsScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [sortMenuVisible, setSortMenuVisible] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  const headerOpacity = useRef(new Animated.Value(0)).current
  const headerTranslateY = useRef(new Animated.Value(20)).current

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: colors.onBackground,
      headerTitleStyle: {
        fontFamily: 'ProductSans-Bold'
      },
      title: 'Workouts',
      headerShadowVisible: false
    })
  }, [navigation, colors])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Simular carga
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const handleDelete = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }
    setDeleteDialogVisible(false)
    setSelectedWorkout(null)
  }, [])

  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesDifficulty =
        selectedDifficulty === 'All' ||
        workout.difficulty === selectedDifficulty
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'date') return new Date(b.day) - new Date(a.day)
      return 0
    })

  const renderWorkoutCard = ({ item }) => (
    <WorkoutCard
      workout={item}
      onPress={() =>
        router.push({
          pathname: '/workout/[id]',
          params: { id: item.id }
        })
      }
      onLongPress={() => {
        setSelectedWorkout(item)
        setDeleteDialogVisible(true)
      }}
      onDelete={() => {
        setSelectedWorkout(item)
        setDeleteDialogVisible(true)
      }}
    />
  )

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkoutCard}
          keyExtractor={item => item.id.toString()}
          numColumns={1}
          // columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome6
                name="dumbbell"
                size={48}
                color={colors.onSurfaceVariant}
              />
              <PaperText
                variant="titleMedium"
                style={[
                  styles.emptyStateTitle,
                  { color: colors.onSurfaceVariant }
                ]}
              >
                No workouts found
              </PaperText>
              <PaperText
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                Try adjusting your filters or create a new workout
              </PaperText>
            </View>
          }
        />

        <Portal>
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
              <Button onPress={handleDelete}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'plus',
              label: 'New Workout',
              onPress: () => router.push('/workout/create')
            },
            {
              icon: 'content-copy',
              label: 'Duplicate Workout',
              onPress: () => console.log('Duplicate')
            },
            {
              icon: 'import',
              label: 'Import Workout',
              onPress: () => console.log('Import')
            }
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          }}
        />
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 200
  },
  headerGradient: {
    flex: 1,
    paddingTop: 20
  },
  headerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontFamily: 'ProductSans-Bold',
    marginBottom: 16
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontFamily: 'ProductSans-Bold'
  },
  statLabel: {
    opacity: 0.8
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  searchContainer: {
    padding: 16,
    marginTop: -20,
    zIndex: 1
  },
  searchBar: {
    elevation: 4,
    borderRadius: 8
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  filterScroll: {
    flexGrow: 0,
    marginRight: 16
  },
  filterChip: {
    marginRight: 8
  },
  list: {
    padding: 8
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  progressContainer: {
    gap: 4
  },
  progressBar: {
    height: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 4
  },
  deleteAction: {
    marginVertical: 8,
    marginRight: 8,
    borderRadius: 12,
    width: 80,
    height: '100%'
  },
  deleteActionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 8
  },
  emptyStateTitle: {
    fontFamily: 'ProductSans-Bold',
    marginTop: 16
  }
})
