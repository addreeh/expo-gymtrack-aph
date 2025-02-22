import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur'
import { getUserPreferences } from '@/services/animeAPI'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

interface Props {
  children: React.ReactNode
  intensity?: number
}

export default function AnimeWallpaperBackground({
  children,
  intensity = 60
}: Props) {
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const prefs = await getUserPreferences()
        setWallpaperUrl(prefs.selectedWallpaper)
      } catch (error) {
        console.error('Error loading wallpaper:', error)
      }
    }

    loadWallpaper()
  }, [])

  if (!wallpaperUrl) {
    return <View style={styles.container}>{children}</View>
  }

  return (
    <View style={styles.container}>
      <Image
        source={wallpaperUrl}
        style={StyleSheet.absoluteFill}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
      />
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill}>
        {children}
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
