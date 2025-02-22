import React, { useState } from 'react'
import { View, Image, Pressable, ActivityIndicator } from 'react-native'
import { Text, Portal, Modal, IconButton } from 'react-native-paper'

const ImageGallery = ({ images, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)

  if (isLoading) {
    return (
      <View className="flex items-center justify-center p-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Loading images...</Text>
      </View>
    )
  }

  if (!images?.length) {
    return (
      <View className="flex items-center justify-center p-4">
        <Text>No images available for this anime</Text>
      </View>
    )
  }

  return (
    <>
      <View className="flex-row flex-wrap gap-2">
        {images.map((imageUrl, index) => (
          <Pressable
            key={index}
            className="w-[48%] aspect-square rounded-lg overflow-hidden"
            onPress={() => {
              setSelectedImage(imageUrl)
              setShowModal(true)
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </View>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          className="m-4"
        >
          <View className="bg-white rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Image Preview</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowModal(false)}
              />
            </View>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-full aspect-square rounded-lg"
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </Portal>
    </>
  )
}

export default ImageGallery
