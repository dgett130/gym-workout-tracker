export interface Exercise {
  name: string
  sets: string
  reps: string
  weight: string
}

export interface Workout {
  date: string
  exercises: Exercise[]
}

const STORAGE_KEY = "gym-tracker-workouts"

export async function getWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch("/api/workouts", {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching workouts:", error)
    return []
  }
}

export async function saveWorkout(date: string, exercises: Exercise[]): Promise<boolean> {
  try {
    const response = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, exercises }),
    })
    return response.ok
  } catch (error) {
    console.error("[v0] Error saving workout:", error)
    return false
  }
}

export async function deleteWorkout(date: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/workouts?date=${encodeURIComponent(date)}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("[v0] Error deleting workout:", error)
    return false
  }
}

export async function getRecentExercises(): Promise<Exercise[]> {
  try {
    const workouts = await getWorkouts()

    // Create a map to store the most recent occurrence of each exercise
    const exerciseMap = new Map<string, Exercise>()

    // Iterate through workouts (already sorted by date, most recent first)
    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        // Only add if we haven't seen this exercise name before
        if (!exerciseMap.has(exercise.name.toLowerCase())) {
          exerciseMap.set(exercise.name.toLowerCase(), exercise)
        }
      }
    }

    // Return the first 5 unique exercises
    return Array.from(exerciseMap.values()).slice(0, 5)
  } catch (error) {
    console.error("[v0] Error fetching recent exercises:", error)
    return []
  }
}

export interface ExerciseTemplate extends Exercise {
  id: string
}

export async function getTemplates(): Promise<ExerciseTemplate[]> {
  try {
    const response = await fetch("/api/templates", {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch templates")
    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching templates:", error)
    return []
  }
}

export async function saveTemplate(exercise: Exercise): Promise<boolean> {
  try {
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exercise),
    })
    return response.ok
  } catch (error) {
    console.error("[v0] Error saving template:", error)
    return false
  }
}

export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/templates?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    return response.ok
  } catch (error) {
    console.error("[v0] Error deleting template:", error)
    return false
  }
}
