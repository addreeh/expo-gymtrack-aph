import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList
} from 'react-native'
import {
  Text,
  Surface,
  Button,
  Card,
  Avatar,
  useTheme,
  Portal,
  Modal,
  IconButton,
  ActivityIndicator
} from 'react-native-paper'
import { animes } from '@/constants/animes'
import { getUserPreferences, updateUserPreferences } from '@/services/animeAPI'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchGoogleDriveImages } from '@/services/googleDriveService'

const ImageGrid = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map(
        (url, index) =>
          new Promise(resolve => {
            Image.getSize(
              url,
              (width, height) => {
                resolve({ url, width, height, index })
              },
              error => {
                console.log('Error pre-loading image:', url, error)
                resolve(null)
              }
            )
          })
      )

      const results = await Promise.all(imagePromises)
      setLoadedImages(results.filter(Boolean))
    }

    loadImages()
  }, [images])

  return (
    <View style={styles.imageGrid}>
      {loadedImages.map((image, index) => (
        <Pressable
          key={index}
          onPress={() => console.log('Image pressed')}
          style={({ pressed }) => [
            styles.imageContainer,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Image
            source={{ uri: image.url }}
            style={[
              styles.image,
              {
                width: '100%',
                height: undefined,
                aspectRatio: image.width / image.height
              }
            ]}
            resizeMode="cover"
            onError={error => {
              console.log('Image load error:', error.nativeEvent.error)
              setErrors(prev => ({ ...prev, [index]: true }))
            }}
          />
        </Pressable>
      ))}
    </View>
  )
}

export default function ProfileScreen() {
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: getUserPreferences
  })

  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError
  } = useQuery({
    queryKey: ['animeImages', selectedAnime?.id],
    queryFn: async () => {
      if (!selectedAnime) return null
      console.log('Selected anime folders:', selectedAnime.images)
      try {
        const result = await fetchGoogleDriveImages(selectedAnime.images)
        return result
      } catch (error) {
        console.error('Error fetching images:', error)
        throw error
      }
    },
    enabled: !!selectedAnime
  })

  const updatePreferencesMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
    }
  })

  useEffect(() => {
    if (preferences?.selectedAnime) {
      const anime = animes.find(a => a.id === preferences.selectedAnime)
      setSelectedAnime(anime)
    }
  }, [preferences])

  const handleAnimeSelect = async anime => {
    setSelectedAnime(anime)
    await updatePreferencesMutation.mutateAsync({
      selectedAnime: anime.id
    })
  }

  const renderAnimeCard = ({ item }) => (
    <Card
      style={[
        styles.animeCard,
        {
          backgroundColor:
            selectedAnime?.id === item.id
              ? colors.primaryContainer
              : colors.surface
        }
      ]}
      onPress={() => handleAnimeSelect(item)}
    >
      <Card.Cover source={{ uri: item.coverImage }} />
      <Card.Title
        title={item.title}
        subtitle={item.description}
        titleStyle={{ fontFamily: 'ProductSans-Bold' }}
      />
    </Card>
  )

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Surface style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.profileInfo}>
          <Avatar.Image
            size={80}
            source={require('@/assets/images/bakugo.jpg')}
          />
          <View style={styles.userInfo}>
            <Text
              variant="headlineSmall"
              style={{ fontFamily: 'ProductSans-Bold' }}
            >
              John Doe
            </Text>
            <Text variant="bodyMedium">john.doe@example.com</Text>
          </View>
        </View>
        <Button mode="contained" onPress={() => console.log('Edit profile')}>
          Edit Profile
        </Button>
      </Surface>

      <View style={styles.section}>
        <Text
          variant="titleLarge"
          style={[styles.sectionTitle, { color: colors.onBackground }]}
        >
          Anime Preferences
        </Text>
        <Text
          variant="bodyMedium"
          style={[
            styles.sectionDescription,
            { color: colors.onSurfaceVariant }
          ]}
        >
          Choose your favorite anime to customize your workout images
        </Text>

        <FlatList
          data={animes}
          renderItem={renderAnimeCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animeList}
        />
      </View>

      {selectedAnime && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: colors.onBackground }]}
            >
              Available Images
            </Text>
            <IconButton
              icon="refresh"
              mode="contained"
              onPress={() =>
                queryClient.invalidateQueries({
                  queryKey: ['animeImages', selectedAnime.id]
                })
              }
            />
          </View>

          {imagesLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <ImageGrid images={images || []} />
          )}
        </View>
      )}

      <Portal>
        <Modal
          visible={showImageModal}
          onDismiss={() => setShowImageModal(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: colors.background }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Preview Image
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowImageModal(false)}
            />
          </View>
          {/* Add image preview content here */}
        </Modal>
      </Portal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    padding: 20,
    marginBottom: 20
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  userInfo: {
    marginLeft: 20
  },
  section: {
    padding: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontFamily: 'ProductSans-Bold',
    marginBottom: 8
  },
  sectionDescription: {
    marginBottom: 16
  },
  animeList: {
    paddingVertical: 10,
    gap: 16
  },
  animeCard: {
    width: 280,
    marginRight: 16
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 4
  },
  imageContainer: {
    width: '48%',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0'
  },
  image: {
    width: '100%',
    backgroundColor: '#f0f0f0'
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontFamily: 'ProductSans-Bold'
  }
})
