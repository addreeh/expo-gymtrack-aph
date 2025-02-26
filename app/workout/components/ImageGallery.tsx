import React from 'react'
import { View, ScrollView, Pressable, Image } from 'react-native'
import { PaperText, Button } from 'react-native-paper'

const ImageGallery = ({ images, handleImageSelect, refetchImages }) => {
  if (!images?.length) {
    return (
      <View className="p-5 items-center">
        <PaperText>No images available</PaperText>
        <Button onPress={() => refetchImages()}>Retry Loading Images</Button>
      </View>
    )
  }

  return (
    <ScrollView className="max-h-80">
      <View className="flex-row flex-wrap p-2 gap-2">
        {images.map((url, index) => (
          <Pressable
            key={index}
            className="w-[48%] aspect-square rounded-lg overflow-hidden"
            onPress={() => handleImageSelect(url)}
          >
            <Image
              source={{ uri: url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

export default ImageGallery
