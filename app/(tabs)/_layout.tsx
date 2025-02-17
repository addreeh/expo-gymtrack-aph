import React from 'react'
import { Tabs } from 'expo-router'
import { BottomNavigation } from 'react-native-paper'
import { useTheme } from 'react-native-paper'
import { FontAwesome6 } from '@expo/vector-icons'

export default function TabLayout() {
  const { colors } = useTheme()

  const renderIcon = ({ route, focused, color }) => {
    let iconName
    switch (route.name) {
      case 'index':
        iconName = 'house'
        break
      case 'exercises':
        iconName = 'dumbbell'
        break
      case 'create-workout':
        iconName = 'plus'
        break
      default:
        iconName = 'circle-question'
    }
    return <FontAwesome6 name={iconName} size={24} color={color} />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (event.defaultPrevented) {
              preventDefault()
            } else {
              navigation.navigate(route.name)
            }
          }}
          renderIcon={({ route, focused, color }) =>
            renderIcon({ route, focused, color })
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key]
            return options?.title || route.name
          }}
          style={{
            backgroundColor: colors.elevation.level2,
            borderTopWidth: 1,
            borderTopColor: colors.outline
          }}
          activeColor={colors.primary}
          inactiveColor={colors.onSurfaceVariant}
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home'
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises'
        }}
      />
      <Tabs.Screen
        name="create-workout"
        options={{
          title: 'Create'
        }}
      />
      <Tabs.Screen
        name="edit-workout/[id]"
        options={{
          href: null
        }}
      />
    </Tabs>
  )
}
