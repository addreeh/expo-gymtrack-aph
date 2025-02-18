// src/utils/exerciseTranslations.ts

// Diccionario de traducciones español -> inglés
export const exerciseTranslations: Record<string, string> = {
  // Ejercicios de pecho
  'press de banca': 'bench press',
  'press inclinado': 'incline bench press',
  'press declinado': 'decline bench press',
  aperturas: 'chest fly',
  fondos: 'chest dips',
  pullover: 'pullover',

  // Ejercicios de espalda
  dominadas: 'pull ups',
  'jalones al pecho': 'lat pulldown',
  remo: 'row',
  'remo con barra': 'barbell row',
  'peso muerto': 'deadlift',
  hiperextensiones: 'back extension',

  // Ejercicios de hombros
  'elevaciones laterales': 'lateral raises',
  'press militar': 'military press',
  'press de hombros': 'shoulder press',
  'elevaciones frontales': 'front raises',
  'elevaciones posteriores': 'rear delt fly',
  'encogimientos de hombros': 'shrugs',

  // Ejercicios de brazos
  'curl de bíceps': 'bicep curl',
  'curl martillo': 'hammer curl',
  'curl concentrado': 'concentration curl',
  'extensiones de tríceps': 'tricep extension',
  'fondos para tríceps': 'tricep dips',
  'press francés': 'skull crusher',

  // Ejercicios de piernas
  sentadillas: 'squats',
  'prensa de piernas': 'leg press',
  'extensiones de piernas': 'leg extension',
  'curl de piernas': 'leg curl',
  zancadas: 'lunges',
  'peso muerto rumano': 'romanian deadlift',
  'elevaciones de pantorrilla': 'calf raises',

  // Ejercicios de abdominales
  abdominales: 'crunches',
  plancha: 'plank',
  'elevaciones de piernas': 'leg raises',
  'mountain climbers': 'mountain climbers',
  'rueda abdominal': 'ab wheel rollout',

  // Ejercicios funcionales/cardio
  burpees: 'burpees',
  'saltos al cajón': 'box jumps',
  flexiones: 'push ups',
  'sentadillas con salto': 'jump squats',
  escaladores: 'mountain climbers'
}

/**
 * Traduce un nombre de ejercicio del español al inglés
 *
 * @param spanishName - Nombre del ejercicio en español
 * @returns Nombre del ejercicio en inglés o el nombre original si no hay traducción
 */
export const translateExerciseName = (spanishName: string): string => {
  if (!spanishName) return ''

  // Normaliza el nombre (minúsculas y sin espacios extra)
  const normalizedName = spanishName.toLowerCase().trim()

  // Busca en el diccionario
  return exerciseTranslations[normalizedName] || normalizedName
}

/**
 * Obtiene sugerencias de traducción para un nombre de ejercicio
 * basado en coincidencias parciales
 *
 * @param spanishName - Nombre del ejercicio en español
 * @returns Array de posibles traducciones en inglés
 */
export const getSimilarExercises = (spanishName: string): string[] => {
  if (!spanishName) return []

  const normalizedName = spanishName.toLowerCase().trim()
  const words = normalizedName.split(' ')

  // Busca ejercicios que contengan al menos una palabra similar
  const matches: string[] = []

  Object.entries(exerciseTranslations).forEach(([spanish, english]) => {
    for (const word of words) {
      if (word.length > 3 && spanish.includes(word)) {
        matches.push(english)
        break
      }
    }
  })

  return matches
}
