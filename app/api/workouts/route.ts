import { NextResponse } from "next/server"
import { db } from "@/lib/db/db"
import { workouts, exercises } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

// Helper function to parse Italian date
function parseItalianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number)
  return new Date(year, month - 1, day)
}

export async function GET() {
  try {
    // Fetch all workouts with their exercises
    const allWorkouts = await db.query.workouts.findMany({
      with: {
        exercises: true,
      },
      orderBy: [desc(workouts.id)], // We'll sort by date in JS to match previous behavior
    })

    // Sort by date (most recent first)
    const sorted = allWorkouts.sort((a, b) => {
      const dateA = parseItalianDate(a.date)
      const dateB = parseItalianDate(b.date)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("[v0] Error reading workouts:", error)
    return NextResponse.json({ error: "Failed to read workouts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { date, exercises: newExercises } = await request.json()

    if (!date || !newExercises || !Array.isArray(newExercises)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Check if workout for this date already exists
    const existingWorkout = await db.query.workouts.findFirst({
      where: eq(workouts.date, date),
    })

    let workoutId: number

    if (existingWorkout) {
      workoutId = existingWorkout.id
    } else {
      // Create new workout
      const [newWorkout] = await db
        .insert(workouts)
        .values({ date })
        .returning({ id: workouts.id })

      workoutId = newWorkout.id
    }

    // Insert exercises
    if (newExercises.length > 0) {
      await db.insert(exercises).values(
        newExercises.map((ex: any) => ({
          workoutId,
          name: ex.name,
          sets: ex.sets.toString(),
          reps: ex.reps.toString(),
          weight: ex.weight.toString(),
        }))
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving workout:", error)
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    // Delete workout (cascade will handle exercises)
    await db.delete(workouts).where(eq(workouts.date, date))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting workout:", error)
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 })
  }
}
