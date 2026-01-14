import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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

const DATA_FILE = path.join(process.cwd(), "data", "workouts.json")

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify([]))
  }
}

async function readWorkouts(): Promise<Workout[]> {
  await ensureDataFile()
  const content = await fs.readFile(DATA_FILE, "utf-8")
  return JSON.parse(content)
}

async function writeWorkouts(workouts: Workout[]): Promise<void> {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(workouts, null, 2))
}

export async function GET() {
  try {
    const workouts = await readWorkouts()

    // Sort by date (most recent first)
    const sorted = workouts.sort((a, b) => {
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
    const { date, exercises } = await request.json()

    if (!date || !exercises || !Array.isArray(exercises)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const workouts = await readWorkouts()
    const existingIndex = workouts.findIndex((w) => w.date === date)

    if (existingIndex >= 0) {
      // Append exercises to existing workout
      workouts[existingIndex].exercises.push(...exercises)
    } else {
      // Create new workout
      workouts.push({ date, exercises })
    }

    await writeWorkouts(workouts)

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

    const workouts = await readWorkouts()
    const filtered = workouts.filter((w) => w.date !== date)

    await writeWorkouts(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting workout:", error)
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 })
  }
}

function parseItalianDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number)
  return new Date(year, month - 1, day)
}
