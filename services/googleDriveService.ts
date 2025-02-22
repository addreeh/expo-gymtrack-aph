import axios from 'axios'
import * as FileSystem from 'expo-file-system'

const CACHE_DIRECTORY = `${FileSystem.cacheDirectory}google_drive_cache/`
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

interface CacheMetadata {
  timestamp: number
  urls: string[]
}

// Helper to extract folder ID from Google Drive URL
const extractFolderId = (folderUrl: string): string => {
  const matches = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/)
  return matches?.[1] || ''
}

// Helper to generate direct download URL for an image
const getImageDownloadUrl = (fileId: string): string => {
  // Añadimos el parámetro sz para reducir el tamaño de la imagen
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`
}

const ensureCacheDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, {
      intermediates: true
    })
  }
}

const getCacheKey = (folderUrls: string[]): string => {
  return folderUrls.map(url => extractFolderId(url)).join('')
}

const getCachedImages = async (cacheKey: string): Promise<string[] | null> => {
  try {
    const metadataPath = `${CACHE_DIRECTORY}${cacheKey}_metadata.json`
    const metadataInfo = await FileSystem.getInfoAsync(metadataPath)

    if (!metadataInfo.exists) return null

    const metadataStr = await FileSystem.readAsStringAsync(metadataPath)
    const metadata: CacheMetadata = JSON.parse(metadataStr)

    if (Date.now() - metadata.timestamp > CACHE_EXPIRY) {
      return null // Cache expired
    }

    return metadata.urls
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

const cacheImages = async (cacheKey: string, urls: string[]) => {
  try {
    await ensureCacheDirectory()
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      urls
    }
    const metadataPath = `${CACHE_DIRECTORY}${cacheKey}_metadata.json`
    await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata))
  } catch (error) {
    console.error('Error caching images:', error)
  }
}

export const fetchGoogleDriveImages = async (
  folderUrls: string[]
): Promise<string[]> => {
  console.log('Starting fetchGoogleDriveImages with URLs:', folderUrls) // Log 4

  const cacheKey = getCacheKey(folderUrls)
  console.log('Cache key:', cacheKey) // Log 5

  // Try to get cached results first
  const cachedUrls = await getCachedImages(cacheKey)
  console.log('Cached URLs:', cachedUrls) // Log 6

  if (cachedUrls) {
    return cachedUrls
  }

  try {
    const imageUrls: string[] = []

    for (const folderUrl of folderUrls) {
      const folderId = extractFolderId(folderUrl)
      console.log('Folder ID:', folderId) // Log 7

      const apiUrl = `https://www.googleapis.com/drive/v3/files`
      const params = {
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
        fields: 'files(id,name,mimeType)',
        key: process.env.GOOGLE_DRIVE_API_KEY
      }

      console.log('API request:', apiUrl, params) // Log 8

      const response = await axios.get(apiUrl, { params })
      console.log('API response:', response.data) // Log 9

      const folderImageUrls = response.data.files.map(
        (file: { id: string }) => {
          const url = getImageDownloadUrl(file.id)
          console.log('Generated URL for file:', file.id, url) // Log 10
          return url
        }
      )

      imageUrls.push(...folderImageUrls)
    }

    // Cache the results
    await cacheImages(cacheKey, imageUrls)

    return imageUrls
  } catch (error) {
    console.error('Detailed error in fetchGoogleDriveImages:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    }) // Log 12
    throw error
  }
}
