import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { useColorScheme } from '@/components/useColorScheme'
import '../global.css'
import { verifyInstallation } from 'nativewind'
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme
} from 'react-native-paper'
import {
  useMaterial3Theme,
  getMaterial3Theme
} from '@pchmn/expo-material3-theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30 // 30 minutes
    }
  }
})

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)'
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'ProductSans-Regular': require('../assets/fonts/ProductSans-Regular.ttf'),
    'ProductSans-Bold': require('../assets/fonts/ProductSans-Bold.ttf'),
    'ProductSans-Italic': require('../assets/fonts/ProductSans-Italic.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  verifyInstallation()

  const { theme: dynamicTheme } = useMaterial3Theme()

  const paperTheme = {
    ...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
    colors: colorScheme === 'dark' ? dynamicTheme.dark : dynamicTheme.light
  }

  const navigationTheme = {
    ...(colorScheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...NavigationDefaultTheme.colors,
      background: paperTheme.colors.background,
      primary: paperTheme.colors.primary
    }
  }

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="exercise/[id]"
            options={{
              title: 'Exercise Detail'
            }}
          />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  )
}
