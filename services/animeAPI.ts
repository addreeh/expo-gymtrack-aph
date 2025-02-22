import AsyncStorage from '@react-native-async-storage/async-storage'

interface UserPreferences {
  selectedAnime: string | null
  selectedWallpaper: string | null
}

const PREFERENCES_KEY = 'user_preferences'

export const getUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const data = await AsyncStorage.getItem(PREFERENCES_KEY)
    return data
      ? JSON.parse(data)
      : { selectedAnime: null, selectedWallpaper: null }
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return { selectedAnime: null, selectedWallpaper: null }
  }
}

export const updateUserPreferences = async (
  preferences: Partial<UserPreferences>
): Promise<void> => {
  try {
    const currentPreferences = await getUserPreferences()
    const updatedPreferences = { ...currentPreferences, ...preferences }
    await AsyncStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify(updatedPreferences)
    )
  } catch (error) {
    console.error('Error updating user preferences:', error)
    throw new Error('Failed to update preferences')
  }
}
