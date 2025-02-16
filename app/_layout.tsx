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
import 'react-native-reanimated'
import { useColorScheme } from '@/components/useColorScheme'
import '../global.css'
import { verifyInstallation } from 'nativewind'

// Importa PaperProvider y los temas base de Material You
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme
} from 'react-native-paper'
// Importa el hook para el tema dinámico
import {
  useMaterial3Theme,
  getMaterial3Theme,
  getMaterial3ThemeAsync,
  isDynamicThemeSupported
} from '@pchmn/expo-material3-theme'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)'
}

// Evitar que la pantalla de splash se oculte antes de que se carguen los assets.
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

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  console.log('get', getMaterial3Theme().dark)
  verifyInstallation()

  const { theme: dynamicTheme } = useMaterial3Theme()

  // Corrección de temas dinámicos de React Native Paper
  const paperTheme = {
    ...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
    colors: colorScheme === 'dark' ? dynamicTheme.dark : dynamicTheme.light
  }

  // Tema de React Navigation (opcional)
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
