import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import CustomAppBar from '@/components/CustomAppBar'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false // Oculta el header de React Navigation
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'GymtrackAPH',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          header: () => <CustomAppBar title="Tab One" /> // Usa AppBar personalizada
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'GymtrackAPH',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          header: () => <CustomAppBar title="Tab Two" />
        }}
      />
    </Tabs>
  )
}
