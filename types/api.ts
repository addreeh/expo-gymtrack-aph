export interface ExerciseAPI {
  name: string
  type: string
  muscle: string
  equipment: string
  difficulty: string
  instructions: string
  gifUrl: string
}

export interface APIError {
  message: string
  code: string
}

export interface APIResponse<T> {
  data: T
  error: APIError | null
}
