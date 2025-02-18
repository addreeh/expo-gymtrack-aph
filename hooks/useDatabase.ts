import { useState, useEffect } from 'react'
import { initDatabase, migrateMockData } from '@/services/database'

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initDb = async () => {
      try {
        await initDatabase()
        await migrateMockData()
        setIsReady(true)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Database initialization failed')
        )
      }
    }

    initDb()
  }, [])

  return { isReady, error }
}
