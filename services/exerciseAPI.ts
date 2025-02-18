import axios from 'axios'
import { ExerciseAPI, APIResponse } from '@/types/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  translateExerciseName,
  getSimilarExercises
} from '@/utils/exerciseTranslations'

const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours
const API_URL = 'https://exercisedb.p.rapidapi.com'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'X-RapidAPI-Key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
})

const getCacheKey = (endpoint: string) => `exercise_cache_${endpoint}`

const getFromCache = async (endpoint: string) => {
  try {
    const cached = await AsyncStorage.getItem(getCacheKey(endpoint))
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data
      }
    }
    return null
  } catch (error) {
    console.error('Cache error:', error)
    return null
  }
}

const setCache = async (endpoint: string, data: any) => {
  try {
    await AsyncStorage.setItem(
      getCacheKey(endpoint),
      JSON.stringify({
        data,
        timestamp: Date.now()
      })
    )
  } catch (error) {
    console.error('Cache error:', error)
  }
}

export const getExercise = async (
  id: string
): Promise<APIResponse<ExerciseAPI>> => {
  if (!id || id.length < 4) {
    return {
      data: null,
      error: {
        message: 'El ID debe tener al menos 4 caracteres',
        code: '400'
      }
    }
  }

  try {
    const cached = await getFromCache(`/exercises/exercise/${id}`)
    if (cached) {
      console.log('Using cached exercise data for ID:', id)
      return { data: cached, error: null }
    }

    console.log('Fetching exercise data for ID:', id)
    const response = await api.get(`/exercises/exercise/${id}`)
    await setCache(`/exercises/exercise/${id}`, response.data)
    return { data: response.data, error: null }
  } catch (error) {
    console.error('Error fetching exercise details:', error.message)
    return {
      data: null,
      error: {
        message:
          error.response?.data?.message ||
          `Failed to fetch exercise with ID ${id}`,
        code: error.response?.status?.toString() || '500'
      }
    }
  }
}

export const searchExercises = async (
  query: string,
  offset: number = 0,
  limit: number = 10
): Promise<APIResponse<ExerciseAPI[]>> => {
  if (!query) {
    return {
      data: [],
      error: {
        message: 'Se requiere un término de búsqueda',
        code: '400'
      }
    }
  }

  // Traducir la consulta del español al inglés
  const translatedQuery = translateExerciseName(query)
  console.log(`Traducción: "${query}" -> "${translatedQuery}"`)

  // Format the query: lowercase and replace spaces with hyphens or %20
  const formattedQuery = translatedQuery.toLowerCase().trim()
  console.warn('Searching for:', formattedQuery)

  try {
    const endpoint = `/exercises/name/${formattedQuery}?offset=${offset}&limit=${limit}`
    const cached = await getFromCache(endpoint)
    if (cached && cached.length > 0) {
      console.log('Using cached data')
      return { data: cached, error: null }
    }

    // Log the complete request details for debugging
    console.log('API Request:', {
      url: `${API_URL}${endpoint}`,
      headers: {
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY
          ? '*****'
          : 'NOT SET',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    })

    const response = await api.get(endpoint)
    console.warn('API response data length:', response.data.length)

    if (response.data && response.data.length > 0) {
      await setCache(endpoint, response.data)
      return { data: response.data, error: null }
    } else {
      // Si no hay resultados, intentar buscar ejercicios similares
      console.log('No exact matches, trying similar exercises...')
      const similarExercises = getSimilarExercises(query)

      if (similarExercises.length > 0) {
        console.log('Found similar exercises:', similarExercises)
        // Intentar con el primer ejercicio similar
        const similarQuery = similarExercises[0]
        const similarEndpoint = `/exercises/name/${similarQuery}?offset=${offset}&limit=${limit}`
        const similarResponse = await api.get(similarEndpoint)

        if (similarResponse.data && similarResponse.data.length > 0) {
          await setCache(endpoint, similarResponse.data) // Cache under original query
          return { data: similarResponse.data, error: null }
        }
      }

      // Attempt with partial match as last resort
      console.log('No similar matches, trying partial match with first word...')
      const partialQuery = formattedQuery.split(' ')[0] // Try just the first word
      const partialEndpoint = `/exercises/name/${partialQuery}?offset=${offset}&limit=${limit}`
      const partialResponse = await api.get(partialEndpoint)

      if (partialResponse.data && partialResponse.data.length > 0) {
        await setCache(endpoint, partialResponse.data) // Cache under original query
        return { data: partialResponse.data, error: null }
      }

      // Still no results, use fallback data
      return { data: [], error: null }
    }
  } catch (error) {
    console.error('API error details:', error.response?.data || error.message)
    return {
      data: null,
      error: {
        message: error.response?.data?.message || 'Failed to search exercises',
        code: error.response?.status?.toString() || '500'
      }
    }
  }
}

// Función para ayudar a depurar/expandir el diccionario
export const logMissingTranslation = async (spanishName: string) => {
  try {
    const missingTranslations = await AsyncStorage.getItem(
      'missing_translations'
    )
    let translations = missingTranslations
      ? JSON.parse(missingTranslations)
      : {}

    if (!translations[spanishName]) {
      translations[spanishName] = {
        count: 1,
        timestamp: Date.now()
      }
    } else {
      translations[spanishName].count++
      translations[spanishName].timestamp = Date.now()
    }

    await AsyncStorage.setItem(
      'missing_translations',
      JSON.stringify(translations)
    )
  } catch (error) {
    console.error('Error logging missing translation:', error)
  }
}
