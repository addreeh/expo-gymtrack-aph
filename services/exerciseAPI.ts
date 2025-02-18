import axios from 'axios'
import { ExerciseAPI, APIResponse } from '@/types/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  // Format the query: lowercase and replace spaces with hyphens or %20
  const formattedQuery = query.toLowerCase().trim()
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
      // Attempt with partial match
      console.log('No exact matches, trying partial match...')
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
